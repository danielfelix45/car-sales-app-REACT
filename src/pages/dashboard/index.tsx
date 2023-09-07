import { useEffect, useState, useContext } from "react";

import { FiTrash2 } from "react-icons/fi";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/dashboardHeader";

import { collection,getDocs, where, query, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { ref, deleteObject } from "firebase/storage";
import { AuthContext } from "../../contexts/AuthContext";

interface ICarProps{
  id: string;
  name: string;
  year: string;
  price: string | number;
  city: string;
  km: string;
  images: IImageCarProps[];
  uid: string;
}

interface IImageCarProps{
  name: string;
  uid: string;
  url: string;
}

export function Dashboard(){
  const [cars, setCars] = useState<ICarProps[]>([]);
  const {user} = useContext(AuthContext);

  useEffect(() => {

    function loadCars(){
      if(!user?.uid){
        return;
      }
      // Aqui busca a coleção de carros no banco de dados
      const carsRef = collection(db, 'cars')
      // Aqui pega apenas os carros que foram cadastrados pelo usuário
      const queryRef = query(carsRef, where('uid', '==', user.uid))

      // Aqui busca os itens e mostra os items
      getDocs(queryRef)
      .then((snapshot) => {
        let listcars = [] as ICarProps[];

        snapshot.forEach( doc => {
          listcars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid,
          })
        })

        setCars(listcars);
        console.log(listcars)
      })
    }

    loadCars();
  }, [user]);

  async function handleDeleteCar(car: ICarProps){
    const itemCar  = car;
    // Aqui vai no banco de dados e busca o carro pelo id
    const docRef = doc(db, 'cars', itemCar.id)
    // Aqui deleta o carro no banco de dados
    await deleteDoc(docRef)

    // Aqui deleta o carro no storage tbm
    itemCar.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath)

      try{
        await deleteObject(imageRef)
        // Retorna o array de carros menos o carro que foi deletado
        setCars(cars.filter(car => car.id !== itemCar.id))
      }catch(e){
        console.log('ERRO AO EXCLUIR ESSA IMAGEM')
      }
    })
  }

  return(
    <Container>
      <DashboardHeader/>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map(car => (
          <section key={car.id} className="w-full bg-white rounded-lg relative">
            <button onClick={() => handleDeleteCar(car)} className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
              <FiTrash2 size={26} color='#000'/>
            </button>

            <img 
              className="w-full rounded-lg mb-2 max-h-70"
              src={car.images[0].url}
              alt="Carro" 
            />
            <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km} km</span>
              <strong className="text-black font-bold mt-4">R$ {car.price}</strong>
            </div>

            <div className="w-full h-px bg-slate-300 my-2"></div>

            <div className="px-2 pb-2">
              <span className="text-black">
                {car.city}
              </span>
            </div>
          </section>
        ))}
      </main>

    </Container>
  )
}