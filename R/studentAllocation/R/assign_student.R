assign_student <- function( student, project, lecturer, env){
  
  ## Assign student to project
  env$project_assignments[[ project ]] <- c( env$project_assignments[[ project ]], student )
  env$lecturer_assignments[[ lecturer ]] <- c( env$lecturer_assignments[[ lecturer ]], student )
  env$student_assignments[[ student ]] <- project
  
  ## remove from unallocated students
  idx = which(env$unallocated_students == student)
  if( length(idx) )
    env$unallocated_students <- env$unallocated_students[ -idx ]

}