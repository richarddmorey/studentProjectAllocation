# Student Project Allocation

An implementation of Abraham et al's (2007) algorithm for allocation of student projects. See Abraham et al (2007): 

[Abraham, D.J., Irving, R.W., and Manlove, D.M. (2007) Two algorithms for the student-project allocation problem. Journal of Discrete Algorithms, 5(1), pp. 73-90. (doi:10.1016/j.jda.2006.03.006)](http://eprints.gla.ac.uk/3439/)

This code assigns students to projects according to their SPA-student algorithm, given preferences of students for projects, preferences of lecturers for students, and the offerings of projects by lecturers.

The main code is in the `bin` directory. Input files containing details of the student preferences (`students.txt`), lecturer preferences (`lecturers.txt`), and projects offered by lecturers (`projects.txt`) are placed in the `input` directory. Example input files are offered.

Utility functions for the algorithm reside in `lib/studentAllocation.pm`.

To run the code once the input files are in place, run

    perl allocate.pl

from the `bin` directory.

Output files giving the allocations by student (`studentsAssignments.txt`), by lecturer (`lecturerAssignments.txt`), and by project (`projectAssignments.txt`) are generated in the `output` directory. Examples are given in the `output` directory.

Students that cannot be allocated by the algorithm will be listed on the first line of the `studentAssignments.txt` file. Undercapacity projects and lecturers will be given on the first line of their respective files. In cases where students cannot be allocated, turning on random assignment (`$randomize = 1`) in the script will assign the remaining students to undercapacity projects.
