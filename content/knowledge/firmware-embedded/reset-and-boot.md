---
id: concept.reset-and-boot
type: concept
locale: en
slug: reset-and-boot
area: firmware-embedded
title: Reset and boot — runtime state, images and entry conditions
summary: Explain the path to main, budget RAM and vectors and distinguish image
  loading, authenticity and recovery policy.
status: published
updated: 2026-10-26
prerequisites:
  - concept.microcontrollers-and-mmio
related:
  - path.firmware-and-embedded
sources:
  - title: Arm CMSIS-Core — Startup File, reset, stack and vector table
    url: https://arm-software.github.io/CMSIS_6/latest/Core/startup_c_pg.html
  - title: U-Boot — Standard Boot Overview, boot devices, methods and bootflows
    url: https://docs.u-boot.org/en/latest/develop/bootstd/overview.html
---
## Explain what happens before main

A program cannot assume that its runtime environment exists immediately after reset. A processor begins according to its architecture and device-specific reset rules. Startup code establishes enough state to call application code, while a bootloader may select and prepare the application image.

Separate processor reset behavior, board initialization, language-runtime initialization and application policy. Some simple products enter one firmware image directly. Others use immutable boot ROM, one or more bootloaders and a later operating system. There is no universal sequence identical across every MCU and application processor.

The Cortex-M CMSIS startup convention provides a concrete example: a vector table supplies an initial main stack pointer and handler addresses; a reset handler calls system initialization and transfers to the runtime that eventually invokes main. Read the selected device's actual startup arrangement before applying that example elsewhere.

## Establish valid memory state

Initialized writable objects often need their initial bytes copied from a persistent image into RAM. Zero-initialized objects need their RAM cleared. Common toolchain names are .data for the former and .bss for the latter; read-only code and constants are placed according to the linker configuration.

The fact that an application expects a global variable to begin at zero does not mean arbitrary SRAM hardware powers up as zero. The runtime must provide the language's required initial state, or a particular retained section must have its own documented contract.

For a teaching memory budget, assume RAM of 16 KiB, initialized writable data of 1 KiB, zero-initialized data of 3 KiB and reserved stack space of 2 KiB. Remaining space is 16 − 1 − 3 − 2 = 10 KiB before any other allocations.

| Region | RAM use (KiB) |
| --- | --- |
| Initialized writable data | 1 |
| Zero-initialized data | 3 |
| Reserved stack | 2 |
| Remaining budget | 10 |

The initialized 1 KiB also requires initial-value storage in the persistent image under this copy model. The 3 KiB zero region needs RAM but can be represented in the image by a size and initialization rule instead of 3 KiB of explicit zero bytes.

## Place the stack and vectors correctly

The stack stores runtime call state and automatic data according to the ABI and compiler. Interrupt entry may also use a stack, depending on the architecture and configuration. Its permitted range, alignment and maximum depth must be considered before calling complex code.

A vector table associates exceptions or interrupts with entry addresses. In a model with 32-bit table entries and table base 0x08000000, entry index 5 begins at 0x08000000 + 5 × 4 = 0x08000014. This is an arithmetic example, not a claim that index 5 is the same interrupt on every device.

Confusing an interrupt number with a raw vector-table index can produce an incorrect lookup. Core exception entries and peripheral entries may use different numbering conventions. CMSIS exposes IRQ numbers and vector access functions to keep those rules explicit.

## Separate loading from trusting an image

A bootloader may locate an image, verify structural metadata, place sections, establish entry conditions and transfer control. Validation includes range checks: image lengths and destination addresses must fit the reserved regions without overlap or integer overflow.

A checksum can detect some accidental corruption. It is not a cryptographic authorization decision. A signature check can establish authenticity under a key and policy, while rollback protection addresses a different issue: whether an older but authentic image may still be accepted.

Recovery and update policy are part of the product design. If power fails during replacement, a bootable image or recovery path may need to remain. Naming slots A and B does not establish atomic metadata updates, health checks or a safe fallback policy by itself.

## Count a boot interval with explicit boundaries

Suppose an illustrative startup spends 2 ms in ROM selection, 5 ms loading, 1 ms initializing RAM and 3 ms configuring required peripherals. Serialized time to application readiness is 11 ms. This is not necessarily the time to display the first UI, join a network or serve a request.

Measurements need a start event and a completion event. A reset-pin edge, first instruction and first useful sample are different timestamps. Parallel initialization and retries can change the total, so simply summing nominal component times is only valid for the stated serialized model.

Once the application runs, retain enough diagnostics to distinguish reset causes and initialization failures. A watchdog reset can be evidence of missing progress, but the watchdog should not be refreshed by code that runs even while the useful application is stuck. Startup and fault policy determine what “running” actually means.

## Exercises and explained answers

1. If the RAM budget instead reserves 4 KiB for the stack, what remains? 16 − 1 − 3 − 4 = 8 KiB before other allocations.
2. At the stated vector base, where does entry 9 begin? 0x08000000 + 36 = 0x08000024. The entry's meaning still comes from the architecture's table.
3. Does zero-filled .bss imply the entire RAM was reset to zero electrically? No. The runtime initializes specified regions; retained or unused areas can have different contents.
4. Does a matching checksum prove an update came from an authorized publisher? No. Integrity against accidental errors and authenticity under an adversarial model require different evidence.

Boot connects persistent program bytes to a valid execution environment. Interrupts and drivers then let that program respond to hardware while normal work continues.
