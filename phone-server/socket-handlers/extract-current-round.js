function extractCurrentRound(ssData) {
  let {currentRound} = ssData;
  let {id, pointsAvailable, name, description, image} = currentRound;
  let answers = currentRound.answers;
  let choices = currentRound.choices.map(c => c === 'correct' ? null : c);

  return {
    id,
    pointsAvailable,
    name,
    description,
    choices,
    answers,
    image
  };
}

module.exports = extractCurrentRound;
