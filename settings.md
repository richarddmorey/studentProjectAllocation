---
layout: page
title: Settings
permalink: /settings/
sidebar_link: true
sidebar_sort_order: 4
back_page: index.md
---

{% include fa_include.html %}

In the allocation app, you can change the settings by clicking on the "Settings" button (shown below).

<button id="cog_button" style="pointer-events: none;"> <i class="fa fa-cogs fa-2x" ></i> Settings </button>
<script>
  document.getElementById('cog_button').tabIndex = -1
</script>

Clicking on the "Settings" button will open a window that will allow changing the following options.

| Setting | Default value | Description |
|:-------|:-------------|:-------------|
| Shuffle students first? | true | Randomize the student order at the start? Students higher up in the list will get first consideration. This may be desired. If not, then you might randomize the students to increase fairness. |
| Randomly distribute unassigned students? | true | Select this option to randomly distribute the unallocated students after the algorithm runs. If this option is not selected, then unallocated students will remain unallocated. If desired, you can run the algorithm without this option, then turn setting on, and click "Allocate" again. This will randomly allocate the remaining students. |
| Iteration limit | 10000 | Limit on the number of SPA-Student iterations. This can be increased after an allocation, and the allocation continued, if needed. |
| Time limit | 60 | Limit on the total time needed for the SPA-Student algorithm (in seconds). This can be increased after an allocation, and the allocation continued, if needed. |
| Log level | 1 | (0-4) Detail to give in logs. 0 turns logging off; 4 is most detailed. Increasing the log level can slow down allocation.| 
| Random seed | (new default on every page load) | Seed used for shuffling students and randomly distributing unallocated students. This allows reproducing any allocation after the fact if desired. | 

