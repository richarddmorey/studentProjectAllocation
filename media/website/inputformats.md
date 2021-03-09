---
layout: page
title: Input file formats
permalink: /input/
sidebar_link: true
sidebar_sort_order: 2
back_page: index.md
---


All input files should be plain text files. Information in each file is given in rows, one for each lecturer, project, or student (depending on the file).

The items in a row of a file are separated by spaces or tabs(so **remember not to include spaces or tabs** in any of your IDs).

Both the number of students ranked by each lecturer and the number of ranked projects per student may vary, the number of columns per row in the lecturers and students file will be variable. Many programs require output to files with the same number of columns in each row; to get around this, simply make the final elements of shorter rows empty or spaces, and output a tab-delimited file. The extra elements will be stripped. 

* ToC
{:toc}




## Lecturers file

<a href="https://github.com/richarddmorey/studentProjectAllocation/blob/master/R/studentAllocation/inst/examples/original/lecturers.txt" target="_blank">Example lecturers file &#11157;</a>

Each row of the lecturers file indicates the preferences of a particular lecturer. There are three main pieces of information per lecturer:

1. Lecturer ID (character string, no spaces)
2. Lecturer capacity (integer)
3. List of student IDs (character strings) separated by spaces, in descending order of preference

Each row should define a unique lecturer (no duplicate IDs across rows) and all student IDs given in the preference lists should correspond to a row of the students file. Note that a lecturer does not have to have a preference list, nor do they need to rank every student.

Note that the SPA-Student algorithm of <a href="http://eprints.gla.ac.uk/3439/" target="_blank">&#128196;Abraham et al (2007, section 2.1)</a> assumes that all lecturers have ordered preferences for *every* student that has selected one of their projects. The way the algorithm is implemented here, all students that have listed a lecturer's project but are not on the lecturer's list are appended to the lecturer's preference list in the order in which they appear in the students file, or in random order if the students are randomized first (as per the settings).

Each row of the lecturers file must have at least 2 columns (lecturer ID and cap).

### Example rows

```
WILLIAMS 5 stu_1135 stu_4052 stu_3942
CHEN 4 stu_5861 stu_1135
```

The example above defines two lecturers, WILLIAMS and CHEN, with respective capacities of 5 and 4. WILLIAMS has three student IDs in their preference list, and CHEN has two.


## Projects file


<a href="https://github.com/richarddmorey/studentProjectAllocation/blob/master/R/studentAllocation/inst/examples/original/projects.txt" target="_blank">Example projects file &#11157;</a>

Each row of the projects file defines the parameters of a project. There are three main pieces of information per project:



1. Project ID (character string, no spaces)
2. Project capacity (integer)
3. Lecturer ID (character string, no spaces) indicating which lecturer offers the project


Each row should define a unique project (no duplicate IDs across rows) and all lecturer IDs should correspond to a row of the lecturers file.

The projects file will have three columns in every row.

### Example rows

```
knot_theory 3 CHEN
prime_numbers 2 CHEN
real_analysis 4 WILLIAMS
```

The example above defines three projects, two of which are offered by CHEN and one of which is offered by WILLIAMS.

## Students file

<a href="https://github.com/richarddmorey/studentProjectAllocation/blob/master/R/studentAllocation/inst/examples/original/students.txt" target="_blank">Example student file &#11157;</a>

Each row of the students file indicates the preferences of a particular student. There are three main pieces of information per student:


1. Student ID (character string, no spaces)
2. List of project IDs (character strings) separated by spaces, in descending order of preference

Each row should define a unique student (no duplicate IDs across rows) and all projects IDs given in the preference lists should correspond to a row of the projects file.

Each row of the lecturers file must have at 1 column (student ID).

### Example rows

```
stu_1135 knot_theory prime_numbers
stu_4052 real_analysis knot_theory
stu_3942
stu_5861 prime_numbers real_analysis knot_theory
```

The example above defines four students with different preference orders. Note that a student does not have to have a preference list, nor do they need to rank every project.