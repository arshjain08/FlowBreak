

function purchaseBackground(id){
    if (localStorage.getItem("backgroundList")==null){
        localStorage.setItem("backgroundList","[]");
    }
    console.log(localStorage.getItem("backgroundList"))
    let backgroundList = JSON.parse(localStorage.getItem("backgroundList"));
    if(backgroundList.includes(id)){
        localStorage.preferredBackground = id;
        document.documentElement.style.background = "url(" + "Backgrounds/" + localStorage.getItem("preferredBackground") + ")" + " no-repeat center center fixed";
        document.documentElement.style.backgroundSize = "cover";
    }
    else if (localStorage.getItem("coins")>=300){
        Swal.fire({
            title: 'Do you want to purchase this background? It will be 300 gold.',
            icon:'question',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Yes`,
            denyButtonText: `No`,
            customClass: {
              cancelButton: 'order-1 right-gap',
              confirmButton: 'order-2',
              denyButton: 'order-3',
            }
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.coins = Number(localStorage.coins)-300;
                backgroundList.push(id);
                localStorage.preferredBackground = id;
                document.documentElement.style.background = "url(" + "Backgrounds/" + localStorage.getItem("preferredBackground") + ")" + " no-repeat center center fixed";
                document.documentElement.style.backgroundSize = "cover";
                localStorage.backgroundList = JSON.stringify(backgroundList); 
                Swal.fire(
                    'Good job!',
                    'You earned this background!',
                    'success'
                  )
                document.getElementById("coins").innerHTML = "Coins: " + localStorage.getItem("coins");
                document.getElementById(id).style.opacity = "1";
            } else if (result.isDenied) {
             return; 
            }
          })


    }
    else{
      Swal.fire(
        'Uh Oh!',
        'You do not have enough gold!',
        'error'
      )
    }
}
