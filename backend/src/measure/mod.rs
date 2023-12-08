use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use crate::prelude::*;
use rand::Rng;

const MEASURE_DIRECTORY : &str = "./events";

#[derive(Serialize, Deserialize, Debug)]
enum ActionType {
    AcceptOrReject
}

#[derive(Serialize, Deserialize, Debug)]
struct FactionImpact {
    scientist: isize,
    united_nations: isize,
    cartel: isize
}

#[derive(Serialize, Deserialize, Debug)]
struct MeasureImpact {
    social: isize,
    environmental: isize,
    economic: isize,
    factions: FactionImpact
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RawMeasure {
    source: String,
    prompt: String,
    acceptation_impact: MeasureImpact,
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

fn get_random_measure() -> Measure {
    todo!()
    //Measure::new(
    //    rand::thread_rng().gen_range(0..100).to_string(),
    //    "Measure 1".to_string(),
    //    "This is the first measure".to_string(),
    //    ActionType::AcceptOrReject
    //)
}

#[get("/measure")]
async fn get_measure() -> impl Responder {
    let measure = get_random_measure();

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