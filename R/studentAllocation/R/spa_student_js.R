#' Run the SPA student algorithm of Abraham et al (2007)
#' 
#' This function uses a javascript version of the algorithm.
#'
#' @param student_list A list of student preferences, in the format output by `read_student_file`
#' @param lecturer_list A list of lecturer preferences, in the format output by `read_lecturer_file`
#' @param project_list A list of project definitions, in the format output by `read_project_file`
#' @param randomize Randomize student order before starting the algorithm?
#' @param iteration_limit Iteration limit on the algorithm
#' @param time_limit Time limit in seconds on the algorithm
#' @param distribute_unallocated Randomly distribute unallocated students at the end?
#' @param seed Random seed passed to seedrandom 
#' @param validate perform validation of the inputs in javascript?
#' @param ctx V8 context (for debugging)

#' @return
#' @export
#' 
#' @importFrom V8 v8
#' @importFrom dplyr `%>%`
#' @importFrom purrr map
#'
#' @examples
spa_student_js <- function( student_list, lecturer_list, project_list,
                           randomize = pkg_options()$randomize,
                           iteration_limit = pkg_options()$iteration_limit,
                           time_limit = pkg_options()$time_limit,
                           distribute_unallocated = pkg_options()$distribute_unallocated,
                           seed = NULL, validate = TRUE, ctx = V8::v8()){
  
  opts = list(
    shuffleInit = randomize,
    iterationLimit = iteration_limit,
    timeLimit = time_limit,
    logToConsole = FALSE,
    validateInput = validate
  ) 

  if(!is.null(seed))
    opts$rngSeed = as.character(seed)
    
  ctx$assign("opts", opts)
  
  lecturer_list  %>%
    purrr::map(function(el){
      el$prefs = el$students
      el$students = NULL
      return(el)
    }) %>%
  ctx$assign("lecturers", ., auto_unbox = FALSE)

  ctx$assign("projects", project_list)
  
  student_list %>%
    purrr::map(function(el){
      return(list(prefs=el))
    }) %>%
    ctx$assign("students", ., auto_unbox = FALSE)
  
  
  ctx$source(system.file("js/bundle.js", package = "studentAllocation"))
  ctx$eval("const s = new spa.SPAStudent(lecturers, projects, students, opts)")
  ctx$eval("s.SPAStudent()")
  if(distribute_unallocated)
    ctx$eval("s.randomizeUnallocated()")
  ctx$eval("const out = s.output()")
  ctx$eval("const log = s.log")
  
  return(
    list(
      allocation = ctx$get("out"), 
      log = ctx$get("log"),
      iterations = ctx$get("s.iterations"),
      unallocated_after_SPA = ctx$get("s.unallocatedAfterSPA"),
      unallocated = ctx$get("s.unallocated")
    )
  )
}