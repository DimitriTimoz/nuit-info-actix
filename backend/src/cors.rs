use actix_web::{options, HttpRequest, HttpResponse};

#[options("/{filename:.*}")]
async fn cors_preflight(_req: HttpRequest) -> HttpResponse {
    let mut rep = HttpResponse::Ok();
    rep
        .insert_header(("Access-Control-Allow-Headers", "Content-Type, Cookie, Authorization"))
        .insert_header(("Access-Control-Max-Age", "864000"))
        .insert_header(("Access-Control-Allow-Methods", "GET, POST"))
        .insert_header(("Access-Control-Allow-Origin", "*"))
        .finish()
}
