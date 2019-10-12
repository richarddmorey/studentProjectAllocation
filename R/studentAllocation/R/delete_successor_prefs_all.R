



delete_successor_prefs_all <- function( student, lecturer, env ){
  
  students <- env$lecture_list[[ lecturer ]][[ "students" ]]
  n_students <- length( students )
  
  idx <- which( students == student )

  if( !length(idx) )
    return(NULL)
  if( idx == n_students )
    return(NULL)
  
  successors <- students[-(1:idx)]
  
  for( s in successors ){
    for( p in env$lecturer_projects[[ lecturer ]] ){
      
      proj_pref <- env$projected_preferences[[ p ]]
      idx <- which(proj_pref == s)
      if( length(idx) )
        proj_pref <- proj_pref[ -idx ]
      env$projected_preferences[[ p ]] <- proj_pref
      
      student_projects <- env$student_list[[ s ]]
      idx <- which( student_projects == p )
      if( length(idx) )
        student_projects <- student_projects[ -idx ]
      env$student_list[[ s ]] <- student_projects
    }
  }
  invisible(NULL)
}
  