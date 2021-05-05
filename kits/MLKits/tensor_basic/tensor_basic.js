const data =  tf.tensor([1,2,3]) // data to nowy tensor
data.shape // da shape: [3]
const secondData = tf.tensor([4,5,6])
data.add(secondData)  // da wynik [5,7,9] - doda do siebie wartości z kolumn. Stworzy nowy tensor
data // [1,2,3]
secondData // [4,5,6] - tensory się nie zmienią po operacji add
// przy kazdej operacji powstanie nowy tensor, te, z których tworzymt się nie zmienią!!!
data.sub(secondData) // odejmie [-3,-3,-3]
data.mul(secondData) // multiplikuje [4, 10, 18]
data.div(secondData) // dzieli [0.25, 0.4, 0.5]
// jeżeli shapes są niezgodne, nie zrobimy żadnej powyższej operacji



// dla 2 dimension te operacje też działają
const data2d =  tf.tensor([[1,2,3], [4,5,6]]) // data to nowy tensor
data2d.shape // da shape: [2,3]
const secondData2d = tf.tensor([[4,5,6], [1,2,3]])
data2d.add(secondData2d) // [[5,7,9], [5,7,9]] czyli dodaje całe bloki



// ale jednak potrafi dodawać niepasujące shapes
const data =  tf.tensor([1,2,3]) // shape [3]
const secondData = tf.tensor([4]) // shape [1]
data.add(secondData) // da wynik [5, 6, 7]
// ten proces nazywa się broadcasting
// broadcasting - bierze dwa tensory. przetwarza je, jeśli od prawej do lewej są takie same lub !!! jeden shape jest [1]
// ale uwaga !!!
const data2d =  tf.tensor([
  [1,2,3], 
  [4,5,6]
]) // shape: [2,3]
const secondData2d = tf.tensor([
  [1], [1]
]) // shape [2, 1]
data2d.add(secondData2d) // daje o dziwo 
// [ [0,1,2], 
//   [3,4,5] ] czyli jakby odejmuje....



// wylogowanie tensora
const data =  tf.tensor([1,2,3])
console.log('data', data) // jeśli consollog taki da cały obiekt z info o shape
// ale nie da tej tablicy [1,2,3]
data.print() // oto metodą, dzięki której zrobisz consolloga w tensor flow



// dostęp
const data =  tf.tensor([10 ,20 ,30])
data.get(0) // daje 10, pamiętaj że to nie tablica, tylko obiekt
const data2d =  tf.tensor([
  [10, 20 ,30], 
  [40, 50, 60]
]) // shape: [2,3]
data2d.get(0) // da error, bo jest 2 dimennsion
data2d.get(0, 0) // da 10 (row, column)
data2d.get(0, 1) // da 20 (row, column)
data2d.get(1, 2) // da 60 (row, column)
// data2d.set() - nie ma takiej funkcji. nie można dodać do istniejącego tensora nic.



// slice
const data =  tf.tensor([
  [10, 20 ,30], 
  [40, 50, 60],
  [70, 80, 90]
]) // shape: [3,3]
data.slice([0, 1], [3, 1]) // data.slice([start index], [size]) 
// start index: [0, 1], size: [3, 1]
// start index: [0, 1] row/column, czyli od row 0 i od columny 1 - czyli od 20
// size: [3, 1] row/column, czyli ile chcemy wziąć row - 3 chcemy, i ile kolumn chcemy wziąć - 1.
// czyli daje to [20, 50, 80]
// można to też zapisać jako:
data.slice([0, 1], [data.shape[0], 1])
// można też tak:
data.slice([0, 1], [-1, 1])
// -1 w odniesieniu do row oznacza - daj mi wszystkie, które występują



// concat
const data =  tf.tensor([
  [1, 2, 3], 
  [4, 5, 6],
]) // shape: [2,3]
const data2 =  tf.tensor([
  [7, 8, 9], 
  [10, 11, 12],
]) // shape: [2,3]
data.concat(data2) // [ [1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12] ] - shape [4,3]
data.concat(data2, 0) // [ [1, 2,3], [4, 5, 6], [7, 8, 9], [10, 11, 12] ] - shape [4,3] - default is 0
data.concat(data2, 1) // [ [1, 2, 3, 7, 8, 9], [4, 5, 6, 10, 11, 12] ] - shape [2, 6] - argument 1
// drugi argument mówi o axis wg którego konkatenujemy: 0 - rows, 1 - columns



// sumowanie
const jump =  tf.tensor([
  [1, 4], 
  [1, 4],
]) // shape: [2, 2]
const data =  tf.tensor([
  [1, 2, 3], 
  [4, 5, 6],
]) // shape: [2,3]
data.sum() // 21 - sumuje wszystkie elementy
data.sum(0) // [5, 7, 9] - sumuje po row w jednej kolumnie
data.sum(1) // [6, 15] - sumuje po kolumnach w jednym row
data.sum(0).shape // [3]
data.sum(1, true).shape // [3, 1] argument true robi keep dimension
data.sum(1, true).concat(jump, 1) // [ [6, 1, 4], [15, 1, 4] ] doda i wstawi na początek
data.sum(1).expandDims().shape // [1, 3]
data.sum(1).expandDims(1).shape // [3, 1] robi to samo co sum(1, true)