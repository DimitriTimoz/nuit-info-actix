use serde::{Deserialize, Serialize};
use crate::prelude::*;
use rand::Rng;

#[derive(Serialize, Deserialize)]
enum ActionType {
    AcceptOrReject
}

#[derive(Serialize, Deserialize)]
struct Measure {
    id: String,
    title: String,
    description: String,
    action_type: ActionType
}

impl Measure {
    fn new(id: String, title: String, description: String, action_type: ActionType) -> Measure {
        Measure {
            id,
            title,
            description,
            action_type
        }
    }
}

fn get_random_measure() -> Measure {
    Measure::new(
        rand::thread_rng().gen_range(0..100).to_string(),
        "Measure 1".to_string(),
        "This is the first measure".to_string(),
        ActionType::AcceptOrReject
    )
}

#[get("/measure")]
async fn get_measure() -> impl Responder {
    let measure = get_random_measure();

    HttpResponse::Ok().json(measure)
}