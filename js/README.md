## Usage

The code in `spastudent.ts` implements a class, `SPAStudent`, whose constructor takes four arguments.

| Argument    | Default | Description |
|-------------|---------|-------------|
| `lecturers` | none    | Object containing information about the lecturers and preferences |
| `projects`  | none    | Object containing information about the projects |
| `students`  | none    | Object containing information about the student project preferences |
| `options`   | see below | Object specifying options such as iteration/time limits, etc |


### lecturers object

The lecturers object as passed to the class constructor should be an object with named keys. Each key is a lecturer id (as a string). 
Each element is an object with two elements, `cap` and `preferences` which give the lecturer's overall limit of students and 
their (ordered) preferences for students from greatest to least. `preferences` may be an empty array.

Example:

```
{ 
    lec1: { 
        cap: 5, 
        preferences: [ ] 
    },
    lec2: {
        cap: 7,
        preferences: ['stu23', 'stu43']
    }
}
```

### projects object

The projects object as passed to the class constructor should be an object with named keys. Each key is a project id (as a string). 
Each element is an object with two elements, the project `cap` and the `lecturer` that offers the project. 

Example:

```
{ 
    pro3: { 
        cap: 3, 
        lecturer: 'lec1' 
    },
    pro4: {
        cap: 10,
        lecturer: 'lec2'
    }
}
```

### students object

The students object as passed to the class constructor should be an object with named keys. Each key is a student id (as a string). 
Each element is an object with one element, `preferences`, which gives the student's (ordered) preferences for projects from greatest to least. 
`preferences` may be an empty array.

Example:

```
{ 
    stu23: {  
        preferences: [ 'pro4', 'pro3' ] 
    },
    stu45: {
        preferences: [ ]
    }
}
```

### options object

The default options are given below.


```
 {
      shuffleInit: true,
      iterationLimit: 10000,
      timeLimit: 60,
      logToConsole: false,
      validateInput: true,
      rngSeed: undefined,
      logLevel: 1,
      callback: (i, time, type, m) => { return }
    }
```

| Option   | type | Description |
|-------------|-------------|
| `shuffleInit` | boolean | Randomize student order before allocating? |
| `iterationLimit` | number (>0) | Randomize student order before allocating? |
| `timeLimit` | number (>0)| Total time limit on the SPAStudent algorithm. Algorithm ends if this limit is reached.  |
| `logToConsole` | boolean | Send log to console as well as saving it?  |
| `validateInput` | boolean | Validate input first?  |
| `rngSeed` | string | Random seed for any randomizations  |
| `logLevel` | number (0-4) | Detail of logging (0=off, 4=max detail)  |
| `callback` | function  | callback performed whenever log is written to. (i: iteration, time: timestamp, type: level, m: message)  |


### Interesting properties

| Method   | Description |
|----------|-------------|
| `.log` | Get the current log state |
| `.unallocated` | Currently unallocated students |
| `.fullLecturers`   | List of lecturers that are currently at cap  |
| `.fullProjects`   | List of projects that are currently at cap  |


### Interesting methods

| Method   | Description |
|----------|-------------|
| `.SPAStudent()` | Run the SPA-Student algorithm until an end point is reached. |
| `.next()`       | Run one iteration of the SPA-Student algorithm |
| `.randomizeUnallocated()` | Assign remaining students to random available projects (usually run after `.SPAStudent()`) |
| `.output()` | Obtain an object representing the current assignments of students to projects |


### Output

The output is an array of objects with five values, like the following:

```
[
  {
    student: 'stu04',   // student id
    project: 'pro45',   // project id to which student is assigned
    pCap: 3,            // project cap
    lecturer: 'lec33',  // lecturer supervising the project
    lCap: 4             // lecturer cap
  }
]
```

There will typically be three kinds of entries:

* **All entries defined**: Student was assigned to a project
* **Only `student` defined**: Student was not assigned to any project
* **`student` undefined**: No student was assigned to this project


