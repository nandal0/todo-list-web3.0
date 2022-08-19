pragma solidity >=0.4.22 <0.9.0;

contract Task{

  event AddTask (address recipient,uint taskId);
  event DeletedTask(uint taskId,bool isDeleted);

struct Task{
  uint id;
  string taskText;
  bool isDeleted;
}

  Task[] private tasks;
  mapping(uint => address) taskToOwner;

  function  addTask(string memory taskText,bool isDeleted) external {
    uint taskId=tasks.length;
    tasks.push(Task(taskId,taskText,isDeleted));
    taskToOwner[taskId]=msg.sender;
    emit AddTask(msg.sender,taskId);
  }
  function getMyTasks() external view returns (Task[] memory){
    Task[] memory t=new Task[](tasks.length);
    uint c=0;
    for(uint i=0;i<tasks.length;i++){
      if(taskToOwner[i]==msg.sender && tasks[i].isDeleted==false){
        t[c]=tasks[i];
        c++;
      }
    }
    Task[] memory result=new Task[](c);
    for(uint i=0;i<c;i++){
      result[i]=t[i];
    }
    return result;
  }

  function deleteTask(uint id,bool isDeleted) external {
    if(taskToOwner[id]==msg.sender){
      tasks[id].isDeleted=isDeleted;
      emit DeletedTask(id,isDeleted);
    }
  }
}