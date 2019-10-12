

delete_successor_prefs <- function( student, project, env ){
  
  students <- env$projected_preferences[[ project ]]
  n_students <- length( students )
  idx = which( students == student )
  
  if( !length(idx) )
    return(NULL)
  if( idx == n_students )
    return(NULL)
  
  successors <- students[-(1:idx)]
  
  allocate_log("Successors: ", paste(successors, collapse = " "))
  
  for( s in successors ){
    student_projects <- env$student_list[[ s ]]
    idx <- which( student_projects == project )
    if( length(idx) )
      student_projects <- student_projects[ -idx ]
    env$student_list[[ s ]] <- student_projects
  }
  invisible(NULL)
}