

break_assignment <- function( student, project, lecturer, env ){

  ## Remove from project
  idx <- which( env$project_assignments[[ project ]] == student )
  if( length(idx) )
    env$project_assignments[[ project ]] <- env$project_assignments[[ project ]][ -idx ]
  
  ## Remove from lecturer list
  idx <- which( env$lecturer_assignments[[ lecturer ]] == student )
  if( length(idx) )
    env$lecturer_assignments[[ lecturer ]] <- env$lecturer_assignments[[ lecturer ]][ -idx ]
  
  ## Remove from student list
  env$student_assignments[[ student ]] <- NULL
  
  ## Add back to unallocated
  env$unallocated_students <- c(env$unallocated_students, student)
  
  invisible(NULL)
   
}