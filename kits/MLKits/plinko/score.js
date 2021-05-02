const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel])
}

function runAnalysis() {
  // Write code here to analyze stuff
  const testSetSize = 100;
  // const k = 10; // do sprawdzania, który feature jest najważniejszy

  // żeby przebadać, który feature/parametr jest najbardziej istotny, przenosimy poniższą linijkę do kodu niżej
  // const [testSet, trainingSet] = splitDataset(minMax(outputs, 3), testSetSize)

  // accuracy - niżej zapisane lodashem
  // let numberCorrect = 0;
  // for(let i = 0; i < testSet.length; i++) {
  //  const bucket = knn(trainingSet, testSet[i][0]) 
  //  console.log('runAnalysis / bucket', bucket, testSet[i][3]) // sprawdzamy na ile wyniki zgadzają się z testowym wiadrem
  //  // ale wyniki nie do końca się zgadzają z testowym wiadrem, więc musimy określić procent
  //  if (bucket === testSet[i][3]) { // sprawdzamy więc, kiedy wynik trreningu zgadza się z testowym wiadrem
  //    numberCorrect++;
  //  }
  // }

  _.range(1, 20).forEach(k => { // sprawdzamy dla różnych k (rezygnujemy z badania k, ustawiamy na 10 bo to optymalne)
    // _.range(0, 3).forEach(feature => { // do sprawdzania, który feature jest najważniejszy sprawdzamy dla różnych feature/parametrów
    // const data = _.map(outputs, row => [row[feature], _.last(row)]) // do sprawdzania, który feature jest najważniejszy
    const [testSet, trainingSet] = splitDataset(minMax(outputs, 3), testSetSize)
    // const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize) // do sprawdzania, który feature jest najważniejszy
    const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)) // sprawdzamy na ile wyniki zgadzają się z testowym wiadrem
    // ale wyniki nie do końca się zgadzają z testowym wiadrem, więc musimy określić procent
    // sprawdzamy więc, kiedy wynik trreningu zgadza się z testowym wiadrem
    .size() // bierze długość tablicy
    .divide(testSetSize) // i dzieli ją przez wielkość testowego setu
    .value()
    // console.log('For feature of ', feature, 'Accuracy: ', accuracy) // do sprawdzania, który feature jest najważniejszy
    console.log('For k of ', k, 'Accuracy: ', accuracy) // daje np. 0.4, czyli w 40% przypadków się sprawdza
  });
  
}

function knn(data, point, k) {
  // K-NEAREST NEIGHBOOR (KNN)
  return _.chain(data)
  // poniższa linijka sprawdza się przy jednym feature/parametrze. np. tylko dystance, ale bez bounce i size
  // .map(row => [distance(row[0], point), row[3]]) // wybiera dystans od wybranego point i bucket i wkłada do tablicy
  .map(row => { // ta wersja jest dla dowolnej liczby parametrów
        return [
          distance(_.initial(row), point), 
          _.last(row)
        ]
      })
      .sortBy(row => row[0]) // sortuje od najniższego dystansu: tablica tablic
      .slice(0, k) // wybiera trzy pierwsze wyniki: trzy pierwsze tablice [dystans, numer_wiadra]
      .countBy(row => row[1]) // tworzy obiekt z danymi policzonymi wg ile razy występuje dany numer_wiadra: { "numer_wiadra": ile_razy_występuje}
      .toPairs() // zamienia obiekt na tablicę tablic
      .sortBy(row => row[1]) // sortuje od najniższej liczby ile_razy_występuje: tablica tablic
      .last() // bierze ostatnią tablicę - ["4", 2]:  ["numer_wiadra", ile_razy_występuje]
      .first() // bierze pierwszą wartość z tablicy: "4"
      .parseInt() // zamienia stringa w liczbę
      .value() // zwraca wartość po wszystkich operacjach
    // sam knn daje wynik około 10% - czyli przewiduje najczęstsze wiadro tylko w 10%.
}

// ta funkcja jest dobra przy jednym feature
// tu braliśmy tylko pod uwagę punkt rzutu, a nie bounce i nie size
// pointA = 3000, point B = 350
// function distance(pointA, pointB) {
//   return Math.abs(pointA - pointB)
// }
// ta funkcja dla wielu fetures / parametrów
// pointA = [3000, 0.5, 16], point B = [350, 0.52, 18]
function distance(pointA, pointB) {
  return _.chain(pointA)
    .zip(pointB) // zip bierze tablice (np. dwie) i z wartości na poszczególnych indeksach tworzy nowe tablice
    .map(([a,b]) => (a - b) ** 2) // destrukturyzujemy tablicę i mierzymy odległość
    .sum()
    .value() ** 0.5
}

function splitDataset(data, testCount) { // szukanie idealnego K
  const shuffled = _.shuffle(data); // najpierw musimy wymieszać dane: shuffle

  const testSet = _.slice(shuffled, 0, testCount) // dzielimy dane na test
  const trainingSet = _.slice(shuffled, testCount) // i trainig. testCount określa wielkość danych testowych, np. 10

  return [testSet, trainingSet]
}

// minMax funkcja służy do znormalizowania danych - wcieśnięcia ich w przedział od 0 do 1
function minMax(data, featureCount) { // featureCount - ile kolumn mamy do znormalizowania, (w ostatnie kolumnie jest label)
  const clonedData = _.cloneDeep(data) // głębokie klonowanie

  for(let i = 0; i < featureCount; i++) { // ile kolumn ma być znormalizowanych z tablicy
    const column = clonedData.map(row => row[i]) // wstawia do jednej tablicy wszystkie wartości z danego indeksu we wszystkich tablicach

    const min = _.min(column)
    const max = _.max(column)

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);   // j wybiera row, i wybiera column: [600, 0.5, 16]
    }
  }


  return clonedData;
}