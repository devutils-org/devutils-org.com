// Optional HDL check: requires Icarus Verilog (iverilog and vvp).
// Compile the exact module published in Markdown, not a duplicated source file.
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {spawnSync} from 'node:child_process'
import assert from 'node:assert/strict'
const article=readFileSync('content/knowledge/integrated-circuit-design/rtl-and-hardware-description.md','utf8')
const modules=[...article.matchAll(/```verilog\n([\s\S]*?)\n```/g)]
assert.equal(modules.length,1,'Expected exactly one published module')
const compiler=process.env.IVERILOG??'iverilog',runtime=process.env.VVP??'vvp'
function run(command:string,args:string[]){
 const result=spawnSync(command,args,{encoding:'utf8',timeout:60000})
 if(result.error)throw result.error
 assert.equal(result.status,0,`${command} failed:\n${result.stdout}\n${result.stderr}`)
 return result.stdout
}
const directory=mkdtempSync(join(tmpdir(),'devutils-rtl-'))
try {
 const source=join(directory,'accumulator.v'),bench=join(directory,'testbench.v'),compiled=join(directory,'accumulator.vvp')
 writeFileSync(source,modules[0][1])
 const calls:string[]=[]
 const rows=[...article.matchAll(/^\| (\d) \| ([01]) \| ([01]) \| ([01]{4}) \| ([01]{4}|unknown) \| ([01]{5}|unknown) \| ([01]{4}) \| ([01]{4}) \|$/gm)]
 assert.equal(rows.length,6)
 for(const [, ,reset,enable,d, , ,q,prior] of rows)calls.push(`tick(${reset}, ${enable}, 4'b${d}, 4'b${q}, 4'b${prior});`)
 // Independently seed each possible q, then test every input/reset/enable choice.
 for(let q=0;q<16;q++)for(let d=0;d<16;d++)for(const reset of [0,1])for(const enable of [0,1]){
  calls.push('tick(1, 0, 0, 0, 0);',`tick(0, 1, ${q}, ${q}, 0);`)
  const next=reset?0:enable?(q+d)%16:q,prior=reset?0:enable?q:0
  calls.push(`tick(${reset}, ${enable}, ${d}, ${next}, ${prior});`)
 }
 // Hold a nonzero prior value too, then reproduce the printed exercise.
 calls.push('tick(1, 0, 0, 0, 0);','tick(0, 1, 15, 15, 0);','tick(0, 1, 15, 14, 15);','tick(0, 0, 7, 14, 15);','tick(0, 0, 2, 14, 15);')
 writeFileSync(bench,`\`timescale 1ns/1ps
module testbench;
 reg clk = 0, reset = 0, enable = 0;
 reg [3:0] d = 0;
 wire [3:0] q, prior;
 reg [3:0] old_q, old_prior;
 integer checks = 0;
 accumulator dut(clk, reset, enable, d, q, prior);
 task tick;
  input rst, en;
  input [3:0] data, expected_q, expected_prior;
  begin
   clk = 0; old_q = q; old_prior = prior;
   reset = rst; enable = en; d = data;
   #5;
   if (q !== old_q || prior !== old_prior)
    $fatal(1, "State changed before rising edge at check %0d", checks);
   clk = 1;
   #1; // Observe after nonblocking assignments settle.
   if (q !== expected_q || prior !== expected_prior)
    $fatal(1, "Check %0d q=%b expected=%b prior=%b expected=%b", checks, q, expected_q, prior, expected_prior);
   checks = checks + 1;
   #4; clk = 0;
  end
 endtask
 initial begin
  ${calls.join('\n  ')}
  $display("PASS %0d clocked checks", checks);
  $finish;
 end
endmodule
`)
 run(compiler,['-g2012','-Wall','-s','testbench','-o',compiled,source,bench])
 const output=run(runtime,[compiled])
 assert.ok(output.includes(`PASS ${calls.length} clocked checks`),output)
 console.log(run(compiler,['-V']).split('\n')[0])
 console.log(output.trim())
} finally {rmSync(directory,{recursive:true,force:true})}
