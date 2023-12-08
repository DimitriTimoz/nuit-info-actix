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
    scientist: usize,
    united_nations: usize,
    cartel: usize
}

#[derive(Serialize, Deserialize, Debug)]
struct MeasureImpact {
    social: usize,
    environmental: usize,
    economic: usize,
    factions: FactionImpact
}

#[derive(Serialize, Deserialize, Debug)]
struct RawMeasure {
    source: String,
    prompt: String,
    acceptation_impact: MeasureImpact,
    description: String,
}

impl From<(String, RawMeasure)> for Measure {
    fn from((id, measure): (String, RawMeasure)) -> Self {
        Measure {
            id,
            title: measure.source,
            description: measure.description,
            action_type: ActionType::AcceptOrReject,
        }
    }
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
    FailedToListMeasuresFiles,
    FailedToReadMeasureFile,
    FailedToParseMeasureFile
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

    fn from_file(file_path: String) -> Result<Measure, Error> {
        let file = std::fs::read_to_string(file_path).map_err(|_| Error::FailedToReadMeasureFile)?;
        let file_parsed: RawMeasure = serde_json::from_str(&file).map_err(|_| Error::FailedToParseMeasureFile)?;
        Ok((file_path, file_parsed).into())
    }
}

fn list_measures_files() -> Result<Vec<String>, Error> {
    print!("Listing files in directory: {}", MEASURE_DIRECTORY);

    let mut entries = std::fs::read_dir(MEASURE_DIRECTORY).map_err(|_| Error::FailedToListMeasuresFiles)?;

    print!("Files: ");

    let mut files = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|_| Error::FailedToListMeasuresFiles)?;
        let file_name = entry.file_name().into_string().map_err(|_| Error::FailedToListMeasuresFiles)?;
        files.push(file_name);
    }

    Ok(files)
}

fn load_measures() -> Result<Vec<Measure>, Error> {
    let files = list_measures_files()?;
    let mut measures = Vec::new();

    for file in files {
        let measure = Measure::from_file(file)?;
        measures.push(measure);
    }

    Ok(measures)
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_list_measures_files() {
        let files = list_measures_files().unwrap();
        assert_ne!(files.len(), 0);
    }

    #[test]
    fn test_load_measures() {
        let measures = load_measures();
        println!("{:?}", measures);
        let measures = measures.unwrap();
        assert_ne!(measures.len(), 0);
    }
}