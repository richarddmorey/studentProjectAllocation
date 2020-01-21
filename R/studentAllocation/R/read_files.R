

#' Read in a student project preferences file
#'
#' row i               : student i's preferred projects, in descending order of preference \cr 
#' Rows have variable number of columns, each separated by whitespace \cr 
#' column 1            : unique student id (string)  \cr 
#' column 2-column n_i : list of project names (strings)  \cr 
#'
#' @param filename student file name to read, with full path
#'
#' @return
#' @export
#'
#' @examples
read_student_file <- function( filename ){
  
  stopifnot( file.exists( filename ) )
  
  file_content <- readLines( con = filename )
  split_content <- strsplit( x = trimws(file_content), split = "[ \\t]+" )

  student_list <- list()
  
  for(line in split_content){
    if( line[1] %in% names( student_list ) )
      stop("Duplicate student names found in student file.")
    student_list[[ line[1] ]] <- unique( line[-1] )
  }

  return(student_list)
}

#' Read in a lecturer preferences file
#'
#' row i               : lecturer i's preferences, in descending order of preference \cr
#' rows have variable number of columns, each separated by whitespace \cr
#' column 1            : unique lecturer id (string) \cr
#' column 2            : lecturer capacity (integer) \cr
#' column 3-column n_i : list of student ids, in descending order of preference (strings) \cr
#'
#' @param filename lecturer file name to read, with full path
#'
#' @return
#' @export
#'
#' @examples
read_lecturer_file <- function( filename ){
  
  stopifnot( file.exists( filename ) )
  
  file_content <- readLines( con = filename )
  split_content <- strsplit( x = trimws(file_content), split = "[ \\t]+" )
  
  lecturer_list <- list()
  
  for(line in split_content){
    if( line[1] %in% names( lecturer_list ) ) 
      stop("Duplicate lecturer names found in lecturer file.")
    cap <- as.integer( line[2] )
    
    if( is.na(cap) )
      stop("Invalid cap for lecturer ", line[1], ": ", line[2])

    if( cap < 1 )
      stop("Cap must be greater than 0 for lecturer ", line[1], ": is ", cap)

    lecturer_list[[ line[1] ]] <- list(
      cap = cap,
      students = unique( line[-(1:2)] )
      )
  }  
  
  return(lecturer_list)
}

#' Read in a project list file
#' 
#' row i               : project i specification 
#' rows have three columns, each separated by whitespace
#' column 1            : unique project id (string)
#' column 2            : project capacity (integer)
#' column 3            : lecturer that offers project (string) 
#'
#' @param filename project file name to read, with full path
#'
#' @return
#' @export
#'
#' @examples
read_project_file <- function( filename ){
  
  stopifnot( file.exists( filename ) )
  
  file_content <- readLines( con = filename )
  split_content <- strsplit( x = trimws(file_content), split = "[ \\t]+" )
  
  project_list <- list()
  
  for(line in split_content){
    if( line[1] %in% names( project_list ) )
      stop("Duplicate project names found in projects file.")
    cap <- as.integer( line[2] )
    
    if( is.na(cap) )
      stop("Invalid cap for project ", line[1], ": ", line[2])
    
    if( cap < 1 )
      stop("Cap must be greater than 0 for project ", line[1], ": is ", cap)
    
    if( length(line) > 3)
      stop("Too many elements found in line for project ", line[1] )
    
    project_list[[ line[1] ]] <- list(
      cap = cap,
      lecturer = line[3]
    )
  }  
  
  return(project_list)
}


