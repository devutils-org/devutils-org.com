---
id: concept.embedded-linux
type: concept
locale: en
slug: embedded-linux
area: firmware-embedded
title: Embedded Linux — boot chain, drivers, root filesystems and updates
summary: Connect loader, kernel, hardware description and user space, then
  budget independent storage/RAM models and reason about recovery.
status: published
updated: 2026-10-26
prerequisites:
  - concept.real-time-scheduling
  - concept.reset-and-boot
related:
  - path.firmware-and-embedded
sources:
  - title: U-Boot — Standard Boot Overview, boot devices, methods and bootflows
    url: https://docs.u-boot.org/en/latest/develop/bootstd/overview.html
  - title: Linux kernel — Linux and the Devicetree, hardware description and device
      population
    url: https://docs.kernel.org/devicetree/usage-model.html
  - title: Linux kernel — Ramfs, rootfs and initramfs
    url: https://docs.kernel.org/filesystems/ramfs-rootfs-initramfs.html
  - title: Linux kernel — Bus-Independent Device Accesses, MMIO and ordered accessors
    url: https://docs.kernel.org/driver-api/device-io.html
---
## Add an operating system without losing the hardware model

Embedded Linux runs a Linux-based software stack in a product with particular hardware and operational requirements. A typical system includes boot firmware, a bootloader, a kernel, a hardware description where required, a root filesystem and user-space services.

It is more than placing one kernel file on storage. The kernel needs appropriate drivers and entry conditions, user space needs executable programs and libraries, and the product needs a startup, update and recovery policy. Board support must describe the actual clocks, memory and peripheral connections.

The [bare-metal and RTOS lessons](/learn/firmware-and-embedded/) remain relevant. Interrupts, DMA ownership, buffer lifetime and memory-mapped device semantics still exist; the operating system supplies APIs and protection boundaries for managing them.

## Trace a representative boot chain

A representative system begins in device boot ROM, runs firmware or a loader, initializes required hardware and loads a kernel with the information it needs. A bootloader such as U-Boot can discover boot media and boot methods, load images and transfer control under an architecture-specific contract.

The kernel initializes core subsystems and available drivers, obtains its root filesystem and starts an initial user-space program. That program brings up the remaining user-space services according to the product's policy. Details differ across architectures, distributions and boot configurations.

An initramfs is an archive unpacked into an early root filesystem and can contain early user-space tools and drivers. It may locate and switch to another root, or serve as the product's root itself. An older initrd block-device mechanism is distinct; do not treat the names as exact synonyms for every boot implementation.

A device tree is a structured description of hardware that cannot all be discovered automatically, rather than executable device-driver code. It can describe address ranges, interrupts and relationships among devices. A correct driver can still fail if that description names the wrong interrupt or clock.

## Keep kernel and user-space responsibilities separate

A kernel driver manages privileged device operations and exposes an appropriate interface. User-space applications normally use system calls and device-specific interfaces rather than dereferencing physical register addresses directly.

For example, a serial driver can handle hardware interrupts and buffering, while an application reads a file descriptor through an API. The application's successful read does not require one interrupt per byte; DMA, FIFO batching and scheduling can intervene.

An application processor's CPU virtual address, CPU physical address and device DMA address can be different. The kernel's mapping and DMA APIs preserve that distinction. Copying a bare-metal pointer constant into a Linux application bypasses essential assumptions rather than providing a portable driver.

Processes also bring scheduling and isolation. A memory error in an application is not intended to grant unrestricted access to another process or hardware. Kernel code has different responsibilities and risks, which the operating-systems domain develops further.

## Budget storage and RAM independently

Use an abstract storage layout with 128 MiB total: boot area 8 MiB, system slot A 40 MiB, system slot B 40 MiB and persistent data 32 MiB. Sum is 120 MiB, leaving 8 MiB unallocated under this model.

| Storage region | Size (MiB) |
| --- | --- |
| Boot area | 8 |
| System A | 40 |
| System B | 40 |
| Persistent data | 32 |
| Unallocated | 8 |

MiB means 2^20 bytes. Those persistent sizes say nothing directly about runtime RAM consumption. A compressed image's storage size differs from its decompressed memory use; cache, page tables, driver buffers and application allocations add other demands.

For a separate teaching RAM budget of 64 MiB, reserve 12 MiB for one category of kernel/runtime allocations, 20 MiB for applications and 8 MiB for buffers. The remaining 24 MiB is only budget headroom under those declared nonoverlapping categories, not a prediction from an actual Linux memory report.

## Design updates and recovery as a state machine

Two image slots can preserve a previously working version while another is written. A complete policy must specify which slot is selected, how authenticity is checked, how an attempted boot is recorded and what constitutes successful health confirmation.

Power loss can interrupt image writing or metadata changes. Rollback must account for data-format compatibility and security policy, not merely flip a slot bit. A signed older image may be authentic but disallowed by an anti-rollback policy.

Retain diagnostic distinctions among bootloader selection failure, kernel startup failure, missing root filesystem and user-service failure. Rebooting repeatedly without recording which stage failed can make an otherwise recoverable system hard to diagnose.

## Treat real-time requirements explicitly

Linux can support demanding embedded workloads, and real-time configurations can change scheduling and interrupt handling. Neither a default kernel nor the presence of an RT feature proves an application's worst-case response bound.

Specify the deadline, competing work, driver behavior, allocation paths and required hardware timing. Some products place strict control loops on an MCU while Linux handles UI, networking or higher-level processing. That is a system partitioning choice, not a rule that Linux and real-time work can never coexist.

Measure both useful service readiness and early boot milestones. A first console line does not prove the application is ready to serve a request, just as kernel launch is not the same as complete system boot.

## Exercises and explained answers

1. If each system slot grows to 44 MiB while other storage regions stay fixed, what remains? 8 + 44 + 44 + 32 = 128 MiB, leaving zero unallocated in the arithmetic model.
2. If application RAM grows from 20 to 28 MiB in the separate RAM budget, what headroom remains? 64 − 12 − 28 − 8 = 16 MiB under those assumptions.
3. Does a device-tree node implement the device's driver? No. It describes hardware; code interprets that description and performs the operations.
4. Do two slots alone guarantee power-loss-safe updates? No. Image validation, metadata durability, boot attempts, health confirmation and recovery transitions must also be designed.

The firmware route ends at the boundary of a complete operating system. The next domain explores processes, memory, files and kernel interfaces in detail, building on these hardware and startup foundations.
