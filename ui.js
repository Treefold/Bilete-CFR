(function(){
    const dep_st = document.getElementById("departure-station");
    const arr_st = document.getElementById("arrival-station");
    let option = document.createElement('option');
    option.value = 0;
    option.innerHTML = (STATIONS[0] === undefined) ? 1 : STATIONS[0];
    //option.onclick = "dep_arr();";
    dep_st.appendChild(option);
    for (let i = 1; i < STATIONS_NUMBER-1; ++i) {
        option = document.createElement('option');
        option.value = i;
        option.innerHTML = (STATIONS[i] === undefined) ? i+1 : STATIONS[i];
        //option.onclick = "dep_arr();";
        dep_st.appendChild(option);
        option = document.createElement('option');
        option.value = i;
        option.innerHTML = (STATIONS[i] === undefined) ? i+1 : STATIONS[i];
        arr_st.appendChild(option);
    }
    option = document.createElement('option');
    option.value = STATIONS_NUMBER-1;
    option.innerHTML = (STATIONS[STATIONS_NUMBER-1] === undefined) ? STATIONS_NUMBER : STATIONS[STATIONS_NUMBER-1];
    arr_st.appendChild(option);
})();

(function(){
  const train = document.getElementById("train"); 

  for (let i = 0; i < WAGON_COUNT; ++i) {
      const wagon = document.createElement('div');
      wagon.className = "wagon";

      const wagonNumber = document.createElement('span');
      wagonNumber.textContent = "Vagon " + (i + 1) + ":";
      wagon.appendChild(wagonNumber);

      for (let j = 0; j < COMPARTMENTS_PER_WAGON; ++j) {
          const compartment = document.createElement('span');
          compartment.className = "compartment";
          compartment.textContent = "0/" + COMPARTMENT_CAPACITY;
          wagon.appendChild(compartment);
      }

      train.appendChild(wagon);
  }
})();

(function(){
    const c_wagon = document.getElementById("cancel-wagon");
    for (let i = 0; i < WAGON_COUNT; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + 1;
        c_wagon.appendChild(option);
    }

    const c_compartment = document.getElementById("cancel-compartment");
    for (let i = 0; i < COMPARTMENTS_PER_WAGON; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + 1;
        c_compartment.appendChild(option);
    }
  
    const c_seat = document.getElementById("cancel-seat");
    for (let i = 0; i < COMPARTMENT_CAPACITY; ++i) {
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + 1;
        c_seat.appendChild(option);
    }
})();
 
function dep_arr() {
    const dep_station = document.getElementById("departure-station").value;
    document.getElementById("arrival-station").selectedIndex = dep_station;
    const arr_st = document.getElementById("arrival-station").childNodes;
    const lg = arr_st.length
    for (let i = 0; i < lg; ++i) {
        arr_st[i].style.visibility = (i < dep_station) ? "hidden" : "visible";          
    }
}
