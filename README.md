# Student Project Allocation

An implementation of Abraham et al's (2007) algorithm for allocation of student projects. See Abraham et al (2007): 

[Abraham, D.J., Irving, R.W., and Manlove, D.M. (2007) Two algorithms for the student-project allocation problem. Journal of Discrete Algorithms, 5(1), pp. 73-90. (doi:10.1016/j.jda.2006.03.006)](http://eprints.gla.ac.uk/3439/)

This code assigns students to projects according to their SPA-student algorithm, given preferences of students for projects, preferences of lecturers for students, and the offerings of projects by lecturers.

There are two versions of the algorithm, one (older) written in Perl (under `perl/`) and a preliminary R package (`R/studentAllocation`). Scroll down for details about the Perl version near the bottom of the README.

## R version (`R/studentAllocation`)

First, install the `devtools` package in R. Then use it to install the `studentAllocation` package from this repository:

```
devtools::install_github('richarddmorey/studentProjectAllocation', 
                         subdir = "R/studentAllocation")
```

### Using the shiny app

The package includes a [shiny](https://shiny.rstudio.com/) app so that you can use the funtions from a graphical user interface. Run it with the `shiny_spa_student()` function:

```
studentAllocation::shiny_spa_student()
```

The interface looks something like this:

![student project allocation shiny interface](https://github.com/richarddmorey/studentProjectAllocation/raw/master/media/student_allocation_shiny_large.png)


Full instructions for using the shiny app are included in the interface. You may not even have to read any further than this.

You can also access the shiny app [here](https://richarddmorey.shinyapps.io/studentAllocation/). This link is for demonstration. If you plan on using the app often, though, please do it on your own computer. 

### Read in the input files

Use the functions `read_lecturer_file`, `read_project_file`, and `read_student_file` to read in the respective data files. See [fileFormatDetails.txt](https://github.com/richarddmorey/studentProjectAllocation/blob/master/fileFormatDetails.txt) for more information. For instance, you can read in the example data files that come with the package:

```
stud_list <- studentAllocation::read_student_file(
  system.file("examples/original/students.txt", package = "studentAllocation")
)
lect_list <- studentAllocation::read_lecturer_file(
  system.file("examples/original/lecturers.txt", package = "studentAllocation")
)
proj_list <- studentAllocation::read_project_file(
  system.file("examples/original/projects.txt", package = "studentAllocation")
)
```

This will yield three list objects containing the information in the files. If you have your own data files, you can read them in any way you like as long as they're in the same basic format as the lists produced by the `read_*_file` functions:

| Object                    | Length            | Each element name is | Element contents                                            |
|:--------------------------|:------------------|:---------------------|:------------------------------------------------------------|
| Student preference list   | Num. of students  | A student ID         | Char. vector of student project preferences (project IDs)   |
| Lecturer preference list  | Num. of lecturers | A lecturer ID        | Two elements: `cap` (integer, lecturer cap); `students` (char. vector, lecturer preferences for students (student IDs) |
| Project descriptions      | Num. of projects  | A project ID         | Two elements: `cap` (integer, project cap); `lecturer` (char. vector of length 1, lecturer ID that offers this project)  |

Right now, some consistency checking is done when loading files, but none by the algorithm itself, so ensure that your input is clean if you're creating your own input lists (e.g., no duplicate preferences, all IDs accounted for in the respective list files, etc).

### Running the algorithm

Use the `spa_student` function with the list objects just created to run the algorithm:

```
e = studentAllocation::spa_student( stud_list, lect_list, proj_list )
```

The result is an environment `e` containing all the output. 

### Output

For now, this is just quick and dirty; in the future the output will be easier to work with. You can access the output via the following objects contained in the returned environment:

| Object                   | Type            | Description                                                 |
|:-------------------------|:----------------|:------------------------------------------------------------|
| `student_assignments`    | list            | Which projects are assigned to each student                 |
| `lecturer_assignments`   | list            | Which students are assigned to each lecturer                |
| `project_assignments`    | list            | Which students are assigned to each project                 |
| `unallocated_students`   | char. vector    | Which students are unallocated at the end                   |
| `unallocated_after_spa`  | char. vector    | Which students were unallocated before random distribution  |
| `full_lecturers`         | char. vector    | Which lecturers are at their cap                            |
| `full_projects`          | char. vector    | Which projects are at their cap                             |
| `time`                   | time difference | How long the algorithm took to run                          |
| `iterations`             | integer         | How many spa-student iterations were needed                 |


### Cleaner output

The functions `studentAllocation::neat_project_output()`, `studentAllocation::neat_student_output()`, and `studentAllocation::neat_lecturer_output()` will provide you with neater information when passed the output object. For instance:

Until neater output is available, you can produce nicer output yourself. For instance, you might want to create a `tibble` containing the student assignments and their ranking of that assignment. You can do it like this:

```
student_assignments = studentAllocation::neat_student_output(e)
```

The output in `student_assignments` will look something like this:

```
student_assignments

# # A tibble: 100 x 4
#    student project lecturer student_ranking
#    <chr>   <chr>   <chr>       <int>
#  1 s1      p1      l1              1
#  2 s6      p1      l1              1
#  3 s10     p1      l1              1
#  4 s27     p1      l1              1
#  5 s74     p1      l1              1
#  6 s3      p10     l10             1
#  7 s4      p10     l10             1
#  8 s5      p10     l10             1
#  9 s20     p10     l10             1
# 10 s57     p10     l10             1
# # … with 90 more rows
```

We can also check the distribution of rankings to see how good the allocation was:

```
library(dplyr)
student_assignments %>%
  group_by(  student_ranking ) %>%
  summarise(frequency = n() ) %>%
  mutate( percentage = 100 * frequency / sum(frequency) )

# # A tibble: 6 x 3
#   student_ranking frequency percentage
#      <int>     <int>      <dbl>
# 1        1        78         78
# 2        2         6          6
# 3        3         5          5
# 4        4         1          1
# 5        5         2          2
# 6       NA         8          8
```

The allocation was very good, with almost 80% of students getting their first choice. Only 8% were given random projects.


### Options

You can set various options using the `studentAllocation::pkg_options` function, including:

| Option                    | Type     | Default | Description                                                             |
|:--------------------------|:---------|:--------|:------------------------------------------------------------------------|
| `randomize`               | logical  | `FALSE` | Randomize the student order at the start?                               |
| `iteration_limit`         | integer  | `Inf`   | Limit on the number of iterations for the algorithm (Inf for no limit)  |
| `time_limit`              | numeric  | `60`    | Limit (in seconds) on the time the algorithm runs                       |
| `distribute_unallocated`  | logical  | `TRUE`  | Randomly distribute the unallocated students after the algorithm runs?  |
| `favor_student_prefs`     | logical  | `FALSE` | Experimental. Favor student preferences over lecturer preferences when ordering students? For Abraham et al's (2007) spa-student algorithm this should be `FALSE`. Do not set this to `TRUE` if you want the algorithm to finish.                                                         |
| `print_log`               | logical  | `FALSE` | Print log messages?                                                     |
| `neat_delim`              | logical  | `;` |  Character used to paste together multiple elements in a field in neat output     |

For instance, you can turn on logging by running `studentAllocation::pkg_options( print_log = TRUE )` before `spa_student`.

## Perl version (`perl/`)

The main code is in the `bin` directory. Input files containing details of the student preferences (`students.txt`), lecturer preferences (`lecturers.txt`), and projects offered by lecturers (`projects.txt`) are placed in the `input` directory. Example input files are offered.

Utility functions for the algorithm reside in `lib/studentAllocation.pm`.

You may need to install some extra CPAN modules to make the script work, including [List::MoreUtils](https://metacpan.org/pod/List::MoreUtils) and [Tie::IxHash](https://metacpan.org/pod/Tie::IxHash). For an example showing how to install perl modules, see this [wiki entry](https://how-to.fandom.com/wiki/How_to_install_PERL_modules).

To run the code once the input files are in place, run

    perl allocate.pl

from the `bin` directory. 

Output files giving the allocations by student (`studentsAssignments.txt`), by lecturer (`lecturerAssignments.txt`), and by project (`projectAssignments.txt`) are generated in the `output` directory. Examples are given in the `output` directory.

Students that cannot be allocated by the algorithm will be listed on the first line of the `studentAssignments.txt` file. Undercapacity projects and lecturers will be given on the first line of their respective files. In cases where students cannot be allocated, turning on random assignment (`$distributeUnassigned = 1`) in the script will assign the remaining students to undercapacity projects.
