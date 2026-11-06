# Two imperfect parsers, a real learning process

A look back at a project from my early days at 42, before the AI era, built without looking up an existing parsing solution. Revisited with the perspective I have today.

### Learning to reason without a solution

When I started Minishell at 42, I was still new to programming. I was entering the stage where difficult problems stopped looking like things only other people could solve.

I set myself a constraint: I would not look up an existing parser implementation. In hindsight, that was not necessarily the most efficient way to learn. Compiler construction rests on decades of theory: grammars, automata, recursive descent, precedence algorithms and bottom-up parsing. Studying that work is acquiring intellectual tools.

But this constraint forced me to ask my own questions. What does an operator represent? When should it become the root of a tree? How can I set a parenthesized expression aside and reconnect it later? Should every `|` become a node, even though its semantics differ from `&&` and `||`?

These two successive solutions are neither universal nor free of flaws. Their value lies in the reasoning that produced them.

## 1. A command line is not a flat list

Consider:

```sh
cat file | grep error && echo found || echo missing
```

The tokens form a sequence, but execution follows several rules. Commands connected by `|` share a pipeline. `&&` runs its right side if the left side succeeds; `||` does the opposite. Parentheses introduce subexpressions and a subshell execution scope.

The lexer recognizes token categories. The parser must arrange those tokens into a structure that expresses the expected behavior. This is the same fundamental problem as a compiler frontend, even though a shell has different outputs and semantics.

## 2. First strategy: an iterative tree and a context stack

**Historical version: commit `99c91b3`, `src/tree/_tree_process.c`.**

The first version walks the tokens with a `while` loop. Three structural operations do the work:

- `_op_bt_push_root`: a new `&&` or `||` becomes the root, with the previous tree as its left child.
- `_op_bt_push_right`: inserts a node on the right of the current tree.
- `_scp_push_back` and `_ptr_recovery`: save and restore the outer context around parentheses.

```c
if (tok->type == _AND || tok->type == _OR)
    data->tree = _op_bt_push_root(data->tree,
        _op_bt_create(tok->type, tok));

if (tok->type == _OPEN_PAR)
{
    data->scop = _scp_push_back(data->scop, data->tree);
    data->tree = NULL;
}
else if (tok->type == _CLOSE_PAR)
    data->tree = _ptr_recovery(data->tree, &data->scop);
```

For `A && B || C`, promoting each operator to the root naturally builds `((A && B) || C)`: left associativity, appropriate for these two operators of equal precedence.

For parentheses, the program pushes **a pointer to the outer tree**, starts again with `data->tree = NULL`, then reconnects the inner subtree at the closing parenthesis. Nested state is managed explicitly rather than through the C call stack.

### What this approach is

This is not an LR parser: there are no LR state tables, automaton or general reduction rules. It is not the classic shunting-yard algorithm either. It is a **specialized iterative parser**, combining bottom-up construction of logical operators with a context stack for groups.

### Its actual flaw

The apparent simplicity relies on implicit invariants. `_ptr_recovery` assumes that the saved context points to a valid operator and that the inner tree belongs on its right:

```c
(*scop)->s_bot->ptr_op->right = tree;
```

But a group at the beginning of a line can open while `data->tree == NULL`. In the reviewed code, this creates a null-dereference risk when the group closes. More broadly, the reconnection strategy does not express every possible position of a group.

The idea still has value. It shows the boundary between a clever local solution and a sufficiently general parsing algorithm with formalized, tested invariants.

## 3. Second strategy: simplify the tree, handle pipelines separately

**Later version: `src/tree/_tree_builder.c`, `src/parsing/_parsing.c`, `src/exec/_exec.c`.**

The second version decomposes the work into functions. `_cmd_node` builds a command unit or group; `_tree_builder` repeats the operation while it encounters `&&` or `||`. Joining the subtrees becomes explicit:

```c
*node = _bt_join(*node, tmp_token, tmp_node);
```

`_bt_join` creates an operator node with `left` and `right`. The loop still gives logical operators left associativity. A parenthesized group is now parsed by a recursive call to `_tree_builder`: recursion replaces the explicit context stack for this responsibility.

The more distinctive architectural choice is elsewhere: **pipelines are not represented as chains of binary `PIPE` nodes in the logical tree**.

In `_cmd_node`, a non-parenthesized segment is scanned until the next `&&` or `||`. Later, `_pars_pipe_lines` builds a command list from the `|` separators:

```c
_cmd_push_back(&(*node)->cmd_line, (*node)->token);
/* ... */
if (tmp->x == _PIPE)
    _cmd_push_back(&(*node)->cmd_line, tmp->next);
```

The executor walks this list in `_exec_loop`, creates pipes and launches processes through `_exec_process`. `_exec` handles `&&` and `||` using exit status to implement short-circuiting.

Conceptually, the example becomes:

```text
             OR
           /    \
         AND    echo missing
        /   \
 PIPELINE   echo found
  [cat file]
  [grep error]
```

There are **two levels of representation**: a tree of logical decisions and a command list for pipeline execution. The second representation is closer to what the executor needs to consume.

### Is this a HIR?

The analogy needs care. A compiler's High-level Intermediate Representation retains structured, high-level program concepts after some syntactic processing. Here, the logical tree preserves high-level structure, while the pipeline command list resembles a **specialized lowering toward execution**.

It is reasonable to describe separate abstraction levels or a shell-specific IR in a broad sense. It would be misleading to claim a standardized HIR comparable to `rustc`. Some pipeline preparation in this version also happens during execution, rather than in strictly separated compilation phases.

### Its limitations

This structure fits the Minishell scope but is not a universal shell grammar representation. Some combinations of groups and redirections need additional rules. Recursive tree traversal in `_exec` does not establish full Bash semantics. The coupling between logical representation and late pipeline preparation also deserves to be made explicit.

## 4. What changed between the two strategies

| Dimension | First version | Second version |
|---|---|---|
| Construction | Loop over tokens | `_cmd_node` / `_tree_builder` functions |
| Parentheses | Explicit `scop` stack | Recursion |
| `&&` / `||` | Promote an operator to root | Join subtrees with `_bt_join` |
| Pipelines | Already handled separately in parsing | `cmd_line` lists used later by the executor |
| Strength | Deliberate management of state and subtrees | Clearer code and separation of responsibilities |
| Limit | Fragile reconnection invariants | Specialized grammar and intertwined phases |

The second approach preserves the original intuition — separating logical control from pipelines — while changing how nesting and tree assembly are managed.

## 5. What I take from it in the AI era

Looking back, I would not recommend “never look at a solution” as a universal rule. Copying without understanding and studying the theory behind a problem are different things. Parsing algorithms exist to spare us from rediscovering every trap from scratch.

But I do not regret this experience. It forced me to create my own abstractions, make mistakes, expose assumptions, encounter their limits and revise my architecture. My pride came from proving to myself that I could **reason through a problem that initially felt beyond me**.

In the AI era, the distinction I want to defend is **intellectual responsibility**: being able to explain choices, identify assumptions, understand failures and know why another approach would work better. Both humans and AI can make mistakes.

These imperfect Minishell versions have value because my decisions, shortcuts and progress are visible in them. Theory might have saved me time; independent exploration gave me confidence in my ability to solve problems. Today, I want to bring both together: **the curiosity to build for myself and the humility to study what others have already understood**.

---

### Methodological note

This retrospective draws on two project archives: a historical version containing `src/tree/_tree_process.c`, `_op_bt_push_root.c`, `_op_bt_push_right.c`, `_scp_push_back.c` and `src/parsing/_parsing.c`; and a later version containing `src/tree/_tree_builder.c`, `src/parsing/_parsing.c`, `src/exec/_exec.c` and `_bt_join.c` in `libft`. The illustrated trees are conceptual. This is a static review, not an exhaustive test campaign or proof of Bash compliance.
