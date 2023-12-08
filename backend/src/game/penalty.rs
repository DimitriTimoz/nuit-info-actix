
use super::*;

use rand::Rng;

pub struct Penalty {
    pub cartel_penalty_probability: u8,
    pub united_nations_penalty_probability: u8,
    pub scientist_penalty_probability: u8,
}

pub fn get_penalty(game: &Game) -> Option<Penalty> {
    let mut rng = rand::thread_rng();
    let penalty_random_number = rng.gen_range(0..100);
    let penalty_amount = rng.gen_range(0..10);

    if penalty_random_number < game.get_cartel_penalty_probability() {
        return Some(Penalty {
            cartel_penalty_probability: penalty_amount,
            united_nations_penalty_probability: 0,
            scientist_penalty_probability: 0,
        });
    }

    if penalty_random_number < game.get_united_nations_penalty_probability() {
        return Some(Penalty {
            cartel_penalty_probability: 0,
            united_nations_penalty_probability: penalty_amount,
            scientist_penalty_probability: 0,
        });
    }

    if penalty_random_number < game.get_scientist_penalty_probability() {
        return Some(Penalty {
            cartel_penalty_probability: 0,
            united_nations_penalty_probability: 0,
            scientist_penalty_probability: penalty_amount,
        });
    }

    None
}

pub fn format_penalty(penalty: Penalty) -> String {
    if penalty.cartel_penalty_probability > 0 {
        return format!("Vous avez été pénalisé par le cartel de {} points sur le social", penalty.cartel_penalty_probability);
    }

    if penalty.united_nations_penalty_probability > 0 {
        return format!("Vous avez été pénalisé par les nations unies de {} points sur l'économie", penalty.united_nations_penalty_probability);
    }

    if penalty.scientist_penalty_probability > 0 {
        return format!("Vous avez été pénalisé par les scientifiques de {} points sur l'environnement", penalty.scientist_penalty_probability);
    }

    String::new()
}