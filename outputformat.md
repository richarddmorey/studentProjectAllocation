---
layout: page
title: Output file format
permalink: /output/
sidebar_link: true
sidebar_sort_order: 3
back_page: index.md
---


The output file will be a CSV. Each row represents a student or an empty project. An example of the output is given below:

```
student,project,pCap,lecturer,lCap
s1,p1,5,l1,5
s27,p1,5,l1,5
s10,p1,5,l1,5
s100,p1,5,l1,5
s230,,,,
,p3,4,l3,5
```

If the value in the `student` column is missing, then the row represents a project to which there are no students assigned. If the `student` column has a value but no other column does, then the corresponding student was not allocated to a project.
