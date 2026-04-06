---
author: 'hga'
title: 'A bug on the dark side of the Moon'
description: 'How a specification found what fifty-seven years of scrutiny missed.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-04-07'
heroImage: 'a-bug-on-the-dark-side-of-the-moon.jpg'
tags:
  - 'ai'
  - 'engineering'
  - 'allium'
---

<p class="lede">The Apollo Guidance Computer (AGC) is one of the most scrutinised codebases in history. Thousands of developers have read it. Academics have <a href="https://ntrs.nasa.gov/citations/19750004273">published papers on its reliability</a>. Emulators run it instruction by instruction. We found a bug in it that had been missed for fifty-seven years: a resource lock in the gyro control code that leaks on an error path, silently disabling the guidance platform's ability to realign.</p>

We used Claude and [Allium](https://juxt.github.io/allium), our open-source behavioural specification language, to distil 130,000 lines of AGC assembly into 12,500 lines of specs. The specs were derived from the code itself, and the process signposted us directly to the bug.

## Charting the code

The source code has been publicly available since 2003, when Ron Burkey and a team of volunteers began painstakingly [transcribing it by hand](http://www.ibiblio.org/apollo/) from printed listings at the [MIT Instrumentation Laboratory](https://en.wikipedia.org/wiki/MIT_Instrumentation_Laboratory). In 2016, former NASA intern Chris Garry's [GitHub repository](https://github.com/chrislgarry/Apollo-11) went viral, topping the trending page. Thousands of developers scrolled through the assembly language of a machine with 2K of erasable RAM and a 1MHz clock.

The AGC's programs were stored in 74KB of [core rope](https://en.wikipedia.org/wiki/Core_rope_memory): copper wire threaded by hand through tiny magnetic cores in a factory (a wire passing through a core was a 1; a wire bypassing it was a 0). The women who wove it were known internally as the "Little Old Ladies", and the memory itself was called LOL memory. The program was physically woven into the hardware. Ken Shirriff has analysed it down to [individual gates](https://www.righto.com/) and the [Virtual AGC project](https://www.ibiblio.org/apollo/index.html) runs the software in emulation and verified the recovered source byte-for-byte against the original core rope dumps.

As far as we can determine, no formal verification, model checking or static analysis has been published against the flight code. The scrutiny has been deep, but it has been a particular kind of scrutiny: reading the code, emulating the code, verifying the transcription.

We took a different approach. We used [Allium](https://juxt.github.io/allium) to distil a behavioural specification from the [Inertial Measurement Unit](https://airandspace.si.edu/collection-objects/computer-controllerinertial-measurement-unit-apollo-guidancenavigation-system/nasm_A20010305004) (IMU) subsystem, the gyroscope-based platform that tells the spacecraft which way it is pointing. The specification models the lifecycle of every shared resource: when it is acquired, when it must be released, and on which paths.

It surfaced a bug that reading and emulation had missed.

## Losing the reference

The AGC manages the IMU through a shared resource lock called `LGYRO`. When the computer needs to torque the gyroscopes (to correct platform drift or perform a star alignment), it acquires `LGYRO` at the start and releases it when all three axes have been torqued. The lock prevents two routines from fighting over the gyro hardware at the same time.

<span class="pullquote" text-content="The lock is acquired on the way in and released on the way out. But there is a third possibility, and it doesn't release the lock."></span>

The lock is acquired on the way in and released on the way out. But there is a third possibility, and it doesn't release the lock.

['Caging'](https://airandspace.si.edu/collection-objects/caging-control-indicator-compass-gyro-flux-gate-cutaway/nasm_A19601122000) is an emergency measure: a physical clamp that locks the [IMU's gimbals](https://en.wikipedia.org/wiki/Inertial_measurement_unit) in place to protect the gyroscopes from damage. The crew could trigger it with a guarded switch in the cockpit.

When the torque completes normally, the routine exits via `STRTGYR2` and the `LGYRO` lock is cleared. When the IMU is caged while a torque is in progress, the code exits via a routine called `BADEND`, which does not clear the lock. Two instructions are missing:

```
        CAF  ZERO
        TS   LGYRO
```

Four bytes.

Once `LGYRO` is stuck, every subsequent attempt to torque the gyros finds the lock held, sleeps waiting for a wake signal that will never come, and hangs. Fine alignment, drift compensation, manual gyro torque: all blocked.

On 21 July 1969, while Neil Armstrong and Buzz Aldrin walked on the lunar surface, [Michael Collins](https://en.wikipedia.org/wiki/Michael_Collins_(astronaut)) orbited alone in the Command Module [*Columbia*](https://en.wikipedia.org/wiki/Apollo_11). Every two hours he disappeared behind the Moon, out of radio contact with Earth. "I am alone now, truly alone, and absolutely isolated from any known life. I am it," he wrote in [*Carrying the Fire*](https://en.wikipedia.org/wiki/Carrying_the_Fire). "If a count were taken, the score would be three billion plus two over on the other side of the moon, and one plus God knows what on this side."

During each pass he ran [Program 52](https://en.wikipedia.org/wiki/Apollo_PGNCS), a star-sighting alignment that kept the guidance platform pointed in the right direction. If the platform drifted, the engine burn to bring him home would point the wrong way.

## Radio silence

Here's how the bug may have manifested.

Collins has just finished his star sightings at the optics station in the lower equipment bay and keyed in the final commands. The computer is torquing the gyroscopes to apply the correction across all three axes.

Collins moves back toward the main panel in a cramped cockpit and a pressurised suit, past a [cage switch](http://heroicrelics.org/info/csm/cm-ctrl-panel.html) protected only by a flip-up cover. An elbow catches the cover, the cover catches the switch. The code handles this gracefully: a routine called `CAGETEST` detects the cage, abandons the torque and exits. The P52 fails, and Collins understands why: the cage interrupted the correction. He uncages the IMU and tries to realign.

He starts a new P52. The program hangs.

<span class="pullquote" text-content="No alarm, no program light. The DSKY accepts the input and does nothing."></span>

No alarm, no program light. The [DSKY](https://airandspace.si.edu/collection-objects/keyboard-display-dsky-apollo-guidance-computer/nasm_A19760744000) (display and keyboard, his only interface to the computer) accepts the input and does nothing. He tries V41, the manual gyro torque verb. Same result. Everything else on the computer works. Only gyro operations are dead.

The first failure looked normal: a cage event during alignment, with a known recovery. The second gives no clue what is wrong. The trained response to an accidental cage is to uncage and realign. Nothing in his experience would suggest that the computer needed a full restart. The persistent failure would look like dead gyro hardware.

"My secret terror for the last six months has been leaving them on the Moon and returning to Earth alone", Collins later wrote of the [rendezvous](https://en.wikipedia.org/wiki/Lunar_orbit_rendezvous). A dead gyro system behind the Moon, with Armstrong and Aldrin on the surface waiting for a rendezvous burn that depends on a platform he can no longer align, is exactly that scenario.

A hard reset would have cleared it. But the [1202 alarms](https://en.wikipedia.org/wiki/Apollo_11#Lunar_descent) during the lunar descent had been stressful enough with Mission Control on the line and Steve Bales making a snap [abort-or-continue call](https://www.space.com/apollo-11-guidance-officer-remembers-moon-landing-drama.html).

Behind the Moon, alone, with a computer that was accepting commands and doing nothing, Collins would have had to make that call by himself.

## The known landmarks

Margaret Hamilton (as ["rope mother"](https://airandspace.si.edu/stories/editorial/rope-mother-margaret-hamilton) for LUMINARY) approved the final flight programs before they were woven into core rope memory. Her team at the MIT Instrumentation Laboratory pioneered concepts we now [take for granted](https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer)#Legacy): priority scheduling, asynchronous executive systems, restart protection and software-based error recovery.

Their priority scheduling saved the Apollo 11 landing when the 1202 alarms fired during descent, shedding low-priority tasks under load exactly as designed. Most modern systems don’t handle overload that gracefully.

The most serious bugs that did surface were specification errors, not coding mistakes. Don Eyles, who wrote the lunar landing guidance code, [documented several](https://www.doneyles.com/LM/Tales.html). For example, the ICD for the [rendezvous radar](https://en.wikipedia.org/wiki/Apollo_Lunar_Module#Rendezvous_radar) specified that two 800 Hz power supplies would be frequency-locked but said nothing about phase synchronisation. The resulting phase drift made the antenna appear to dither, generating roughly 6,400 spurious interrupts per second per angle and consuming roughly 13% of the computer's capacity during Apollo 11's descent. This was the underlying cause of the 1202 alarms.

Our bug has the same shape. [`BADEND`](https://github.com/chrislgarry/Apollo-11/blob/master/Luminary099/IMU_MODE_SWITCHING_ROUTINES.agc#L717) is a general-purpose termination routine shared by all IMU mode-switching operations. It clears `MODECADR` (the stall register), wakes sleeping jobs, and exits. But `LGYRO` is a gyro-specific lock, acquired only by the pulse-torquing code and released only by the normal completion path in `STRTGYR2`. When the error path routes through `BADEND`, it handles the general resources correctly, but not the gyro-specific lock.

The AGC was written so defensively that latent bugs like this would be silently corrected by the [restart logic](https://www.ibiblio.org/apollo/hrst/archive/1029.pdf), which clears `LGYRO` as a side effect of full erasable-memory initialisation. Any test that happened to trigger a restart after this bug would see the system recover seamlessly.

The defensive coding hid the bug, but it didn't eliminate it. A cage event without a subsequent restart would still leave the gyros locked. Collins would have no way to realign the guidance platform, no way to verify the attitude for a rendezvous burn, and no diagnostic clue pointing to the fix.

## Star sighting

We found this bug by distilling a behavioural specification of the IMU subsystem using [Allium](https://juxt.github.io/allium), an AI-native behavioural specification language. The specification models each shared resource as an entity with a lifecycle: acquired, held, released.

The IMU entity declares a `gyros_busy` field modelling `LGYRO`. Two rules govern it:

<pre><code class="language-allium">rule GyroTorque {
    -- Sends gyro torquing pulse commands. Reserves the gyros,
    -- enables power supply, and dispatches pulses per axis.
    when: GyroTorque(command: GyroTorqueCommand)

    requires:
        imu.mode != caged
        imu.gyros_busy = false

    ensures:
        imu.gyros_busy = true
        GyroTorqueStarted()
}

rule GyroTorqueBusy {
    -- Gyros already reserved by another torquing operation.
    -- Caller sleeps until LGYRO is cleared.
    when: GyroTorque(command: GyroTorqueCommand)

    requires: imu.gyros_busy = true

    ensures:
        JobSleep(job: calling_job())
}</code></pre>

`GyroTorque` requires `gyros_busy = false` and ensures `gyros_busy = true`: the lock is acquired. Somewhere, on every path that follows, the lock _must_ be released. The spec doesn't show where in the code the release happens, but it makes the obligation explicit: if `gyros_busy` goes to true, _something_ must set it back to false.

With that obligation written down, Claude traced every path that runs after `gyros_busy` is set to true. The normal completion path (`STRTGYR2`) clears it. The cage-interrupted path (`BADEND`) does not. `MODECADR`, the other shared resource, is correctly cleared in `BADEND`: `LGYRO` is missing.

<span class="pullquote left" text-content="A reviewer examining BADEND would see correct, complete cleanup. The specification approached from the other direction."></span>

The specification asked this of every path through the IMU mode-switching code. A reviewer examining `BADEND` would see correct, complete cleanup for every resource `BADEND` was designed to handle. The distillation process approached from the other direction: starting from `LGYRO` and asking whether any paths fail to clear it.

**Tests verify the code as written; a behavioural specification asks what the code is for.**

A specification distilled by Allium models resource lifecycles across all paths, including the ones nobody thought to test. You can view the [Allium specifications](https://github.com/juxt/Apollo-11/tree/master/specs) and [reproduction of the bug](https://github.com/juxt/agc-lgyro-lock-leak-bug) on GitHub.

## Course correction

Hamilton's team released resources by loading the constant zero into the [accumulator](https://www.ibiblio.org/apollo/assembly_language_manual.html) (`CAF ZERO`) and storing it into the lock register (`TS LGYRO`). Every release placed manually, by a programmer who remembered every path that could reach that point.

Modern languages have tried to make lock leaks structurally impossible: Go has [`defer`](https://go.dev/blog/defer-panic-and-recover), Java has [`try`-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html), Python has [`with`](https://docs.python.org/3/reference/compound_stmts.html#the-with-statement), Rust's [ownership system](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html) makes lock leaks a compile-time error.

<span class="pullquote" text-content="Anywhere the programmer is responsible for writing the cleanup, the same bug is waiting."></span>

Nevertheless, lock leaks persist. MITRE classifies the pattern as [CWE-772](https://cwe.mitre.org/data/definitions/772.html): "Missing Release of Resource after Effective Lifetime", and rates its likelihood of exploitation as high. Not all resources are managed by a language runtime. Database connections, distributed locks, file handles in shell scripts, infrastructure that must be torn down in the right order: these are still the programmer's responsibility. Anywhere the programmer is responsible for writing the cleanup, the same bug is waiting.

Every Apollo crew came home safely, but the IMU mode-switching routines were carried forward across [Apollo missions](https://www.ibiblio.org/apollo/Luminary.html) in the Command Module software (COMANCHE) and the Lunar Module software (LUMINARY). The bug, present in both, was never noticed and never fixed.

---

The same approach that surfaced a fifty-seven-year-old bug in flight-proven assembly language can find what's hiding in your codebase. [Let's talk](https://www.juxt.pro/contact/).

*Thanks to [Farzad "Fuzz" Pezeshkpour](https://www.linkedin.com/in/dazraf) for independently [reproducing the bug](https://github.com/juxt/agc-lgyro-lock-leak-bug), and to [Danny Smith](https://www.linkedin.com/in/dansmithy/) and [Prashant Gandhi](https://www.linkedin.com/in/pmgandhi/) for reviewing early drafts of this article.*

<script is:inline>
document.addEventListener('DOMContentLoaded', function() {
  var keywords = /^(rule|entity|when|requires|ensures|default|deferred|use|if|let|in|with|for|as|this|not|guidance)$/;
  var builtins = /^(now|true|false|none|null|pending)$/;
  document.querySelectorAll('code.language-allium').forEach(function(block) {
    var text = block.textContent;
    var result = [];
    var i = 0;
    while (i < text.length) {
      if (text[i] === '-' && text[i + 1] === '-') {
        var end = text.indexOf('\n', i);
        if (end === -1) end = text.length;
        result.push(span('comment', text.slice(i, end)));
        i = end;
        continue;
      }
      if (text[i] === '"') {
        var j = i + 1;
        while (j < text.length && text[j] !== '"') j++;
        j++;
        result.push(span('string', text.slice(i, j)));
        i = j;
        continue;
      }
      if (text[i] === '.' && i + 1 < text.length && /[a-z_]/.test(text[i + 1])) {
        var j = i + 1;
        while (j < text.length && /[a-zA-Z0-9_]/.test(text[j])) j++;
        result.push(span('punctuation', '.'));
        result.push(span('property', text.slice(i + 1, j)));
        i = j;
        continue;
      }
      if (/[A-Za-z_]/.test(text[i])) {
        var j = i;
        while (j < text.length && /[A-Za-z0-9_]/.test(text[j])) j++;
        var word = text.slice(i, j);
        var afterWord = j;
        while (afterWord < text.length && text[afterWord] === ' ') afterWord++;
        if (keywords.test(word)) result.push(span('keyword', word));
        else if (builtins.test(word)) result.push(span('builtin', word));
        else if (/^[A-Z]/.test(word)) result.push(span('type', word));
        else if (text[afterWord] === ':') result.push(span('field', word));
        else result.push(esc(word));
        i = j;
        continue;
      }
      if (/[0-9]/.test(text[i])) {
        var j = i;
        while (j < text.length && /[0-9.,]/.test(text[j])) j++;
        result.push(span('number', text.slice(i, j)));
        i = j;
        continue;
      }
      if (/[=!<>+|]/.test(text[i])) {
        var op = text[i];
        if (i + 1 < text.length && text[i + 1] === '=') op += '=';
        result.push(span('operator', op));
        i += op.length;
        continue;
      }
      if (/[{}()\[\]:,?\/]/.test(text[i])) {
        result.push(span('punctuation', text[i]));
        i++;
        continue;
      }
      result.push(esc(text[i]));
      i++;
    }
    block.innerHTML = result.join('');
  });
  function span(cls, s) { return '<span class="allium-' + cls + '">' + esc(s) + '</span>'; }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
});
</script>
