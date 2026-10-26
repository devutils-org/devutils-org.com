---
id: concept.microcontrollers-and-mmio
type: concept
locale: en
slug: microcontrollers-and-mmio
area: firmware-embedded
title: Microcontrollers and MMIO — peripherals, bits and polling
summary: Connect bare-metal code to specified registers, distinguish read/write
  and W1C behavior and separate volatile from synchronization.
status: published
updated: 2026-10-26
prerequisites:
  - concept.buses-and-io
  - concept.signals-and-states
related:
  - path.firmware-and-embedded
sources:
  - title: Arm CMSIS-Core — Device Header File, peripheral access and address mapping
    url: https://arm-software.github.io/CMSIS_6/latest/Core/device_h_pg.html
  - title: Linux kernel — Bus-Independent Device Accesses, MMIO and ordered accessors
    url: https://docs.kernel.org/driver-api/device-io.html
---
## Recognize the system around a processor core

A microcontroller, MCU, commonly integrates a processor core, memory and peripherals such as timers, serial interfaces and GPIO. An embedded system uses computing to serve a particular device or physical process. These categories overlap: a product may combine an MCU, application processor and dedicated accelerators.

Bare-metal firmware runs without a general-purpose operating system managing the application. That does not mean there is no runtime, library, interrupt handling or structure. A small system can organize work through initialization, a main event loop and short interrupt handlers.

Read the [architecture route](/learn/computer-architecture/) first. Firmware uses architectural instructions to access system state, but the board and peripheral documentation determine which addresses and bits control actual hardware.

## Map a peripheral into the address space

A memory-mapped peripheral interprets accesses to a range of addresses as register operations. Device-specific headers can describe register layouts, access qualifiers and addresses. They reduce repetitive typing, but do not replace the peripheral's semantics.

Use a teaching device with base address 0x40002000 and aligned 32-bit registers:

| Register | Byte offset | Address | Meaning |
| --- | --- | --- | --- |
| CONTROL | 0x00 | 0x40002000 | bit 0 enables capture |
| STATUS | 0x04 | 0x40002004 | bit 0 reports one pending event |
| DATA | 0x08 | 0x40002008 | most recent sample |

These addresses are fictional. They are not instructions to write arbitrary locations on a real board. The useful skill is interpreting a specified map, width and access behavior.

## Define bit operations precisely

A mask selects bits. Bit 3 has mask 1 shifted left by three places, binary 00001000 or decimal 8. For an ordinary read/write 8-bit control model initially 00100000, setting bit 3 by OR gives 00101000, decimal 40. Clearing bit 5 afterward gives 00001000, decimal 8.

A read-modify-write operation first reads a value, changes selected bits and writes back. It is safe only if the register supports that pattern and concurrent changes cannot be lost. Some peripherals provide separate SET and CLEAR registers specifically so software need not rewrite unrelated bits.

Status registers can behave differently. Suppose STATUS bit 0 is write-one-to-clear, W1C: writing a one acknowledges that event, while writing a zero leaves it unchanged. If flags are 1010 and software writes mask 0010 in a four-bit model, the result is 1000.

Reading 1010, OR-ing with 0010 and writing 1010 back would acknowledge both bits 3 and 1. The ordinary “set a bit” idiom has the opposite effect on a W1C status register. Access semantics come before bit arithmetic.

## Distinguish volatile, atomicity and ordering

In embedded C interfaces, volatile-qualified accesses are commonly used for memory-mapped objects whose values can change outside ordinary program execution. They help ensure the compiler performs the required observable accesses under its implementation rules.

Volatile does not make a multi-step read-modify-write atomic, protect a shared buffer, synchronize tasks or automatically provide all device-memory ordering needed by the architecture. A correct driver may need documented accessors, barriers, critical sections or hardware atomic operations.

On systems with virtual memory, a device's bus address may differ from a CPU physical address or a pointer usable by software. Linux drivers use their platform's mapping and accessor APIs. Bare-metal MCU examples should not be copied into Linux user space as though the environments had identical rules.

## Poll a device with an explicit failure path

Polling repeatedly checks a condition. In a simple capture loop, firmware starts the peripheral, waits until status reports ready, reads the sample and acknowledges the event according to the documented rule.

An unbounded loop can hang forever if the device never completes. Use a timeout based on an appropriate timer or bounded model, then report or handle failure. Counting arbitrary software iterations does not automatically establish elapsed time: compiler choices, clock changes and interrupts can alter iteration duration.

For a supplied polling model, checks occur at times 0, 2, 4, 6 and 8 μs. An event becomes ready at 5 μs and remains pending until acknowledged. Firmware first observes it at 6 μs, one microsecond after readiness. If the event can pulse and disappear between checks, this guarantee no longer holds.

GPIO adds physical requirements: pin multiplexing, direction, voltage compatibility, pull resistors and drive capability. Writing an output bit does not prove a connector pin is configured for that GPIO or can safely drive a chosen load. Reuse the interface and power reasoning from electronics.

## Exercises and explained answers

1. What is the address of a register at offset 0x0C from this base? 0x4000200C, assuming byte offsets and the stated map.
2. In an 8-bit ordinary control value 00000101, set bit 4. The result is 00010101, decimal 21. The original bits remain set.
3. For W1C flags 1110, write mask 0100. Which flags remain? 1010. Only the bit written as one clears.
4. Does volatile make a shared counter increment atomic? No. Reading, adding and writing can still be interleaved with another writer. Choose a synchronization mechanism appropriate to the execution contexts.

A peripheral register is a protocol endpoint expressed as an address. Knowing its width, side effects and timing is what turns memory access into a correct device operation.
