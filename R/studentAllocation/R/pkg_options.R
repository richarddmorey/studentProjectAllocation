# Variable, global to package's namespace. 
# This function is not exported to user space and does not need to be documented.
MYPKGOPTIONS <- settings::options_manager(
  randomize = FALSE,
  iteration_limit = Inf,
  time_limit = 60,
  distribute_unallocated = TRUE,
  favor_student_prefs = FALSE,
  print_log = FALSE
)

# User function that gets exported:

#' Set or get options for my package
#' 
#' @param ... Option names to retrieve option values or \code{[key]=[value]} pairs to set options.
#'
#' @section Supported options:
#' The following options are supported
#' \itemize{
#'  \item{\code{randomize}}{(\code{logical};FALSE) Randomize the student order at the start? }
#'  \item{\code{iteration_limit}}{(\code{integer};Inf) limit on the number of iterations for the algorithm (Inf for no limit) }
#'  \item{\code{time_limit}}{(\code{numeric};60) Limit in seconds on the time the algorithm runs}
#'  \item{\code{distribute_unallocated}}{(\code{logical};TRUE) Randomly distribute the unallocated students after the algorithm runs? }
#'  \item{\code{favor_student_prefs}}{(\code{logical};FALSE) Favor student preferences over lecturer preferences when ordering students? SPA-Student default is FALSE. }
#'  \item{\code{print_log}}{(\code{logical};FALSE)  Print log messages?}
#' }
#'
#' @export
pkg_options <- function(...){
  # protect against the use of reserved words.
  settings::stop_if_reserved(...)
  MYPKGOPTIONS(...)
}