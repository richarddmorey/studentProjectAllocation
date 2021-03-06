% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/pkg_options.R
\name{pkg_options}
\alias{pkg_options}
\title{Set or get options for my package}
\usage{
pkg_options(...)
}
\arguments{
\item{...}{Option names to retrieve option values or \code{[key]=[value]} pairs to set options.}
}
\description{
Set or get options for my package
}
\section{Supported options}{

The following options are supported
\itemize{
 \item{\code{randomize}}{(\code{logical};FALSE) Randomize the student order at the start? }
 \item{\code{iteration_limit}}{(\code{integer};Inf) limit on the number of iterations for the algorithm (Inf for no limit) }
 \item{\code{time_limit}}{(\code{numeric};60) Limit in seconds on the time the algorithm runs}
 \item{\code{distribute_unallocated}}{(\code{logical};TRUE) Randomly distribute the unallocated students after the algorithm runs? }
 \item{\code{log_level}}{(\code{integer};1) detail in logs (0-4). 0 turns off; 4 is maximum detail}
 \item{\code{print_log}}{(\code{logical};FALSE)  Print log messages?}
 \item{\code{neat_delim}}{(\code{character};';')  Character used to paste together multiple elements in a field in neat output}
}
}

