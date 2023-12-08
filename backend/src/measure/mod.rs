use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use crate::{prelude::*, game::Game};
use rand::Rng;

const MEASURE_DIRECTORY : &str = "./events";

#[derive(Serialize, Deserialize, Debug)]
enum ActionType {
    AcceptOrReject
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FactionImpact {
    pub scientist: isize,
    pub united_nations: isize,
    pub cartel: isize
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MeasureImpact {
    pub social: isize,
    pub environmental: isize,
    pub economic: isize,
    pub factions: FactionImpact
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RawMeasure {
    source: String,
    prompt: String,
    pub acceptation_impact: MeasureImpact,
    comment: Option<String>,
}

impl From<(String, RawMeasure)> for Measure {
    fn from((id, measure): (String, RawMeasure)) -> Self {
        Measure {
            id,
            title: measure.source,
            description: measure.comment.unwrap_or_default(),
            action_type: ActionType::AcceptOrReject,
        }
    }
}

lazy_static::lazy_static! {
    pub static ref MEASURES: HashMap<String, RawMeasure> = {
        let mut measures = HashMap::new();

        let files = list_measures_files().unwrap();
        for file in files {
            let file_path = format!("{}/{}", MEASURE_DIRECTORY, file);
            let Ok(file) = std::fs::read_to_string(&file_path).map_err(|_| Error::ReadMeasureFile) else {
                eprintln!("Failed to read measure file: {}", file_path);
                continue;
            };
            let raw_measure = match serde_json::from_str(&file) {
                Ok(raw_measure) => raw_measure,
                Err(e) => {
                    eprintln!("Failed to parse measure file {file_path}: {e:?}");
                    continue;
                }
            };
            measures.insert(file, raw_measure);
        }

        measures
    };
}

#[derive(Serialize, Deserialize, Debug)]
struct Measure {
    id: String,
    title: String,
    description: String,
    action_type: ActionType
}

#[derive(Debug)]
enum Error {
    ListMeasuresFiles,
    ReadMeasureFile,
}

fn list_measures_files() -> Result<Vec<String>, Error> {
    print!("Listing files in directory: {}", MEASURE_DIRECTORY);

    let entries = std::fs::read_dir(MEASURE_DIRECTORY).map_err(|_| Error::ListMeasuresFiles)?;

    print!("Files: ");

    let mut files = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|_| Error::ListMeasuresFiles)?;
        let file_name = entry.file_name().into_string().map_err(|_| Error::ListMeasuresFiles)?;
        files.push(file_name);
    }

    Ok(files)
}

pub fn replace_measure(game: &mut Game) {
    let mut possible = MEASURES.keys().collect::<Vec<_>>();
    possible.retain(|key| !game.already_seen_measures.contains(*key));
    let Some(measure) = rand::seq::SliceRandom::choose(possible.as_slice(), &mut rand::thread_rng()) else {return};
    game.current_measure = (*measure).to_owned();
}

#[get("/measure")]
async fn get_measure(request: HttpRequest) -> impl Responder {
    let header_value = request.headers().get("token");

    let token_value = match header_value {
        Some(token) => token.to_str(),
        None => return HttpResponse::BadRequest().body("No token provided"),
    };

    let token_string = match token_value {
        Ok(token) => token,
        Err(_) => return HttpResponse::BadRequest().body("Token is not a string"),
    };

    let uuid = match uuid::Uuid::parse_str(token_string) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid token"),
    };

    let games = crate::game::GAMES.read().await;

    let game = match games.get(&uuid) {
        Some(game) => game,
        None => return HttpResponse::BadRequest().body("No game found"),
    };

    let measure = match MEASURES.get(&game.current_measure) {
        Some(measure) => measure,
        None => return HttpResponse::InternalServerError().body("Measure not found"),
    };

    HttpResponse::Ok().json(measure)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_list_measures_files() {
        let files = list_measures_files().unwrap();
        assert_ne!(files.len(), 0);
    }
}