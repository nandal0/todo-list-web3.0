import WrongNetworkMessage from '../components/WrongNetworkMessage'
import ConnectWalletButton from '../components/ConnectWalletButton'
import TodoList from '../components/TodoList'
import TaskAbi from '../../backend/build/contracts/Task.json';
import { TaksContractAddress } from '../config.js';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react'
/* 
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false }, 
  { id: 1, taskText: 'food', isDeleted: false }, 
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

export default function Home() {
  const [correctNetwork, setCorrecNewtwork] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState()
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    connectWallet();
    getAllTasks()
  }, [])

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {

    try {
      const { ethereum } = window
      if (!ethereum) {
        console.log('metamask not detectd');
        return;
      }
      let chaindId =
        await ethereum.request({ method: 'eth_chainId' })
      console.log('chaind', chaindId);

      const rinkbeyChainId = '0x4';
      if (chaindId !== rinkbeyChainId) {
        alret('you are not connected to rinbkey testnet');
        setCorrecNewtwork(false)
        return
      }
      else {
        setCorrecNewtwork(true)

      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('found account', accounts[0])
      setIsUserLoggedIn(true)
      setCurrentAccount(accounts[0])
    }
    catch (error) {
      console.log(error);
    }
  }

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaksContractAddress,
          TaskAbi.abi,
          signer
        )

        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks)
        console.log('tasks', tasks)

      }
      else {
        console.log('ehteruem boue not exist')
      }
    }
    catch (error) {
      console.log(error)
    }


  }

  // Add tasks from front-end onto the blockchain
  const addTask = async e => {
    e.preventDefault();

    let task = {
      taskText: input,
      isDeleted: false

    }
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaksContractAddress,
          TaskAbi.abi,
          signer
        )
        TaskContract.addTask(task.taskText, task.isDeleted)
          .then(res => {
            setTasks([...tasks, task])
            console.log('add task')
          })
          .catch(error => {
            console.log(error)
          })


      }
      else {
        console.log('ehterum object not exit')
      }

    }
    catch (error) {
      console.log(error)
    }
    setInput('')

  }

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = key => async () => {

    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaksContractAddress,
          TaskAbi.abi,
          signer
        )

     const deletetask=   await TaskContract.deleteTask(key,true)

        console.log('deleted',deletetask)

                                      
        let allTasks = await TaskContract.getMyTasks();

        setTasks(allTasks)
        console.log('tasks', tasks)

      }
      else {
        console.log('ehteruem boue not exist')
      }
    }
    catch (error) {
      console.log(error)
    }

    

  }

  return (
    <div className='bg-[#97b5fe] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? <ConnectWalletButton
        connectWallet={connectWallet}
      /> :
        'is this the correct network?' ? <TodoList
          input={input}
          setInput={setInput}
          addTask={addTask}
deleteTask={deleteTask}
          tasks={tasks}
        /> : <WrongNetworkMessage />}
    </div>
  )
}

