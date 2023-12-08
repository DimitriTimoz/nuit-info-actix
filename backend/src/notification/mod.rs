
use crate::game::Game;
use create::prelude::*;

#[get("/notification")]
pub fn get_notification(game: Game) -> impl Responder {
    HttpResponse::Ok().json(game)
}