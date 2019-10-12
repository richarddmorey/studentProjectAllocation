

#' Check input lists for consistency
#'
#' @param student_list list of student preferences
#' @param lecturer_list list of lecturer preferences and caps
#' @param project_list list of projects, lecturers, and caps
#'
#' @return
#' @export
#'
#' @examples
check_input_lists <- function( student_list, lecturer_list, project_list ){

  check_project_student_consistency( project_list, student_list ) &
    check_lecturer_project_consistency( lecturer_list, project_list ) &
    check_student_lecturer_consistency( student_list, lecturer_list )

}


#' Check consistency of the project and student inputs
#'
#' @param student_list list of student preferences
#' @param project_list list of projects, lecturers, and caps
#'
#' @return
#' @export
#' @importFrom dplyr setdiff
#'
#' @examples
check_project_student_consistency <- function( project_list, student_list ){
  all_projects_in_project_list <- names( project_list )
  all_projects_in_student_list <- unlist( student_list )
  not_in_project_list <- dplyr::setdiff(all_projects_in_student_list, all_projects_in_project_list)
  if( length(not_in_project_list) )
    stop("Projects ", not_in_project_list, " are in student preferences but not in project list.")

  TRUE
}

#' Check consistency of the lecturer and project inputs
#'
#' @param lecturer_list list of lecturer preferences and caps
#' @param project_list list of projects, lecturers, and caps
#'
#' @return
#' @export
#' @importFrom dplyr setdiff
#'
#' @examples
check_lecturer_project_consistency <- function( lecturer_list, project_list ){
  all_lecturers_in_lecturer_list <- names( lecturer_list )
  all_lecturers_in_project_list <- sapply( 
    project_list, 
    function(el)
      el[["lecturer"]]
  )
  not_in_lecturer_list <- dplyr::setdiff(all_lecturers_in_project_list, all_lecturers_in_lecturer_list)
  if( length(not_in_lecturer_list) )
    stop("Lecturers ", not_in_lecturer_list, " are in project list but not in lecturer list.")

  TRUE
}

#' Check consistency of the student and lecturer inputs
#'
#' @param student_list list of student preferences
#' @param lecturer_list list of lecturer preferences and caps
#'
#' @return
#' @export
#' @importFrom dplyr setdiff
#'
#' @examples
check_student_lecturer_consistency <- function( student_list, lecturer_list ){
  all_students_in_student_list <- names( student_list )
  all_students_in_lecturer_list <- unlist(
    lapply(
      lecturer_list, 
      function(el)
        el[["students"]]
    )
  )
  not_in_student_list <- dplyr::setdiff(all_students_in_lecturer_list, all_students_in_student_list)
  if( length(not_in_student_list) )
    stop("Students ", not_in_student_list, " are in lecturer list but not in student list.")
  
  TRUE  
}
