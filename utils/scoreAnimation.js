const speed = 4;

export function incEltNbr(id) {
  const elt = document.getElementById(id);

  const endNbr = Number(document.getElementById(id).innerHTML);

  incNbrRec(0, endNbr, elt);
}

function incNbrRec(i, endNbr, elt) {
  if (i <= endNbr) {
    elt.innerHTML = i;
    setTimeout(function () {
      incNbrRec(i + 1, endNbr, elt);
    }, speed);
  }
}
