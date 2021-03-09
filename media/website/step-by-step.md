---
layout: page
title: Step-by-step demonstration
permalink: /step-by-step/
sidebar_link: true
sidebar_sort_order: 5
back_page: index.md
---

1. <a href="https://github.com/richarddmorey/studentProjectAllocation/raw/master/R/studentAllocation/inst/examples/original/allocation_example.zip" target = "_blank">Download example files&#10549;</a>

2. Unzip the example files you downloaded above. You'll find three individual text files: `lecturers.txt`, `projects.txt`, and `students.txt`. You can compare the contents to the [input format](/input/). These contain, respectively, the information concerning 20 hypothetical lecturers, offering 20 hypothetical projects, to 100 hypothetical students.

3. Go to the [allocation app page](/allocate/).

4. Drag `lecturers.txt` onto the block that says "Drop lecturers file here". 

5. After dropping the lecturers file, you'll see a new block that says "Drop projects file here". Drag `projects.txt` onto this block.

6. After dropping the projects file, you'll see a new block that says "Drop students file here". Drag `students.txt` onto this block.

7. After dropping the students file, the "Allocate" button should appear. Click the "Allocate" button to start the allocation process.

8. Once the allocation process is completed, a "Download" button will appear. Click the "Download" button to download a CSV containing the allocation for every student. See the [output format details](/output/) to see how it is formatted. You should be able to open it in any software that supports CSV files (e.g. Excel).