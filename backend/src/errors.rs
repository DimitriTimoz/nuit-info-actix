use actix_web::{HttpResponse, ResponseError};
use deadpool_postgres::PoolError;
use tokio_pg_mapper::Error as PGMError;
use tokio_postgres::error::Error as PGError;
use derive_more::{Display, From};

#[derive(Display, From, Debug)]
pub enum Error {
    NotFound,
    PGError(PGError),
    PGMError(PGMError),
    PoolError(PoolError),
}
impl std::error::Error for Error {}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        match *self {
            Self::NotFound => HttpResponse::NotFound().finish(),
            Self::PoolError(ref err) => {
                HttpResponse::InternalServerError().body(err.to_string())
            }
            _ => HttpResponse::InternalServerError().finish(),
        }
    }
}
