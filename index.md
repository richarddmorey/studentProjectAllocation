---
layout: page
title: Student Project Allocation
sidebar_link: true
sidebar_sort_order: 0
---

## Introduction

This app is for the allocation of students to projects. It is an implementation of Abraham et al's (2007) SPA-student algorithm:

<a href="http://eprints.gla.ac.uk/3439/" target="_blank">&#128196;Abraham, D.J., Irving, R.W., and Manlove, D.M. (2007) Two algorithms for the student-project allocation problem. <i>Journal of Discrete Algorithms</i>, 5(1), pp. 73-90. (doi:10.1016/j.jda.2006.03.006)</a>


The algorithm assigns students to projects, given preferences of students for projects, the offerings of projects by lecturers, preferences of lecturers for students, and respecting limits on lecturer and project loads.

## How to get started


<a href="https://github.com/richarddmorey/studentProjectAllocation/raw/master/R/studentAllocation/inst/examples/original/allocation_example.zip" target = "_blank">&#11088;Download example files&#10549;</a>

Read the instructions under [Input file formats](input/) to learn how your three input files must be formatted. Then head over to the [app](allocate/) and drag the three required files to their respective spaces. Once these files are uploaded and checked, you can start the allocation algorithm, which will produce output that can be downloaded as a CSV file. See [Output file format](output/) for details about the output file format.
