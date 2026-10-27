---
id: path.firmware-and-embedded
type: path
locale: en
slug: firmware-and-embedded
title: Firmware and embedded — from reset to a running system
summary: "The tenth computing-stack domain: six lessons on MCU registers, boot,
  interrupts, DMA, RTOS scheduling and embedded Linux, with worked exercises."
status: published
updated: 2026-10-26
prerequisites:
  - path.computer-architecture
  - path.electronics-and-pcb
related:
  - path.computer-architecture
steps:
  - concept.microcontrollers-and-mmio
  - concept.reset-and-boot
  - concept.interrupts-and-drivers
  - concept.dma-and-buffer-ownership
  - concept.real-time-scheduling
  - concept.embedded-linux
sources:
  - title: Arm CMSIS-Core — Startup File, reset, stack and vector table
    url: https://arm-software.github.io/CMSIS_6/latest/Core/startup_c_pg.html
  - title: Arm CMSIS-Core — Device Header File, peripheral access and address mapping
    url: https://arm-software.github.io/CMSIS_6/latest/Core/device_h_pg.html
  - title: Arm CMSIS-Core — NVIC, enabling, pending state and interrupt priority
    url: https://arm-software.github.io/CMSIS_6/latest/Core/group__NVIC__gr.html
  - title: Linux kernel — Dynamic DMA mapping Guide, address spaces, coherence and
      transfer direction
    url: https://docs.kernel.org/core-api/dma-api-howto.html
  - title: Zephyr — Scheduling, ready threads, preemption and context switches
    url: https://docs.zephyrproject.org/latest/kernel/services/scheduling/index.html
  - title: U-Boot — Standard Boot Overview, boot devices, methods and bootflows
    url: https://docs.u-boot.org/en/latest/develop/bootstd/overview.html
---
## Connect instructions to hardware events

This tenth domain follows [computer architecture](/learn/computer-architecture/) and [electronics and PCB](/learn/electronics-and-pcb/). It assumes you can trace a register update, interpret a memory address and distinguish a valid signal level from a complete timing contract.

The six English lessons explain bare-metal firmware, RTOS organization and the transition to embedded Linux. They can be followed on paper. Register addresses, rates and memory sizes are supplied teaching inputs, so no unspecified board needs to be programmed to solve the exercises.

## Follow the six lessons

1. **Microcontrollers and MMIO:** read a device map, calculate masks, distinguish W1C flags and make polling failure paths explicit.
2. **Reset and boot:** establish runtime memory and stack state, interpret vector entries and separate loading from image trust.
3. **Interrupts and drivers:** budget latency, acknowledge the right layer and coordinate shared state and request lifetime.
4. **DMA:** transfer ownership, distinguish address spaces and calculate buffer fill and reuse intervals.
5. **Real-time scheduling:** trace ready and blocked work, include interference and understand why priority alone does not prove deadlines.
6. **Embedded Linux:** connect loader, hardware description, kernel and user space, then reason about storage, RAM and update recovery separately.

The path develops responsibility at each boundary: a register write, a completed request, a released buffer, a scheduled job and a healthy boot. An initialization function returning successfully does not automatically establish all of them.

## Combine peripheral, buffer and scheduling models

For the four-bit W1C flag model, begin with STATUS = 1110 and write mask 0100. Which bits remain set? Why would an ordinary read/OR/write idiom be wrong for acknowledging only bit 2?

A DMA receiver obtains 2000 samples/s, each four bytes, in 128-sample ping-pong buffers. Find buffer payload size and fill time. Assume the completed buffer cannot be reused until software has finished processing it. Processing requires 50 ms and scheduling/notification contributes another 20 ms. Does this fit one alternate-buffer interval?

Independently, use the real-time lesson's preemptive model: higher-priority A executes 1 ms every 5 ms; lower-priority B executes 2 ms every 10 ms, both initially released at zero, with no overhead or blocking. Find utilization and the first B response time.

## Explain the combined answer

Writing one to bit 2 clears that flag, leaving 1010. A read/OR/write could also write ones to the other pending flags and clear more than intended. The register's semantics determine the correct operation.

The DMA buffer holds 128 × 4 = 512 bytes. At 2000 samples/s, it fills in 64 ms. Processing plus delay is 70 ms, missing the modeled reuse interval by 6 ms. Faster average work elsewhere does not recover overwritten data; scheduling, buffer capacity or flow control must change.

CPU utilization in the separate schedule is 1/5 + 2/10 = 40%. A runs from 0 to 1 ms, B from 1 to 3 ms, so B's first response time is 3 ms. These are separate models: the 40% result is not evidence that the independently described DMA processing meets its deadline.

## Continue toward operating systems

The next planned domain is operating systems: kernel interfaces, processes, memory, files, drivers and virtualization. Embedded Linux introduces those boundaries; it does not replace their dedicated explanations. The [computing stack](/library/computing-stack/) shows the available material.

Before leaving this route, explain why volatile is not atomicity, a timeout is not hardware cancellation, coherent DMA still needs ordering, utilization is not a complete schedulability proof and two update slots are not a complete recovery design.
