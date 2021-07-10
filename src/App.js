import React from 'react';
import Web3 from "web3";
import './App.css';
import md5 from 'md5';

import OperatorABI from "./eth/OperatorABI.json";
import DataProofABI from "./eth/DataProofABI.json";
import FaucetABI from "./eth/FaucetABI.json";

const operatorAddress = "0x0244D251E1718581F9f3E53dBe60eCAe5062fc89";
const faucetAddress = "0x40015d8B96Fc908f5DD6D8EA7028288Af5643B21";
var dataAddress = "0x0";
var hash = "";
var beschreibung = "";
var benutzername = "";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      // Minimal
      balance: 0,
      message: "No proccess pending",
      error: "No errors",
      betamount: "",
      walleterror: "Loading information",
      address: "0x",
      tokenAddress: "0x02C61B1277059BD23047Ba8f293B3d301dd5926b",
      hash: "",
      info: "",
      name: "",
      proofAddress: "",
      proofDate: "",
      proofHash: "",
      proofInfo: "",
      proofName: "",
      proofMessage: "Der Datennachweis wurde erzeugt und kann nun abgerufen werden.",
      firsttime: true
    }
  }

  /**
   * When webcomponents from render()
   * are displayed correctly, this function
   * will be called to execute JS code.
   */
  componentDidMount = async () => {

    /**
     * Accessing Metamask
     */

    // Initiate a wallet provider for older brownsers
    let web3Provider;

    // For modern browsers
    if (window.ethereum) {
      web3Provider = window.ethereum;
      try {
        // Request Account Access
        await window.ethereum.enable();
      } catch (error) {
        // User denied Account Access
        this.logMetaMask("Please allow access to MetaMask");
        return;
      }
    }
    // For old browsers
    else if (window.web3) {
      web3Provider = window.web3.currentProvider;
    }
    // Default
    else {
      this.logMetaMask("Please install MetaMask");
      return;
    }

    /**
     * Accessing Ropsten Network
     */

    //create web3 wrapper for ethereum modules
    const web3 = new Web3(web3Provider);

    // Compare network ID´s
    const networkID = await web3.eth.net.getId();
    if (networkID !== 3) {
      this.logMetaMask("Please set your network to Ropsten");
      return;
    }
    // Ropsten selected
    else {
      this.logMetaMask("MetaMask connected to Ropsten Wallet");
    }

    // Refresh if permission request is still pending
    if(this.state.metamask === "Loading information" ){
      this.refreshPage();
    }
    
    // Update Ether balance every 2 seconds
    this.setState({ web3 }, () => {
      this.updateBalance();
      setInterval(() => {
        this.updateBalance();
      }, 2 * 1000);
    });
    document.getElementById("starting").style.display = "block";
  }

  /**
   * Will render all tags from React
   * into one webpage and binding the
   * state variables into the frontend.
   * 
   * Formatting is done with CSS
   * in ./App.css
   */
  render = () => {
    const { balance, 
            message, 
            error,
            walleterror,
            proofAddress,
            proofDate,
            proofInfo,
            proofName,
            tokenAddress,
            proofMessage
          } = this.state;
    return (
      <div className="App Mobile">
        <div className="OptionWindow">
        <div>
            <button className="OptionButton" onClick={() => this.refreshPage()}>Startseite</button>
          </div>
          <p></p>
          <div>
            <button className="OptionButton" onClick={() => this.toggleData()}>Datennachweis</button>
          </div>
          <p></p>
          <div>
            <button className="OptionButton" onClick={() => this.toggleToken()}>Tokenerhalt</button>
          </div>
        </div>
        <div className="Container">
          <div className="WalletStatusContainer">
            <div className="WalletStatusBar">
              <div className="WalletStatusLeft" >
                <img className="MetamaskPicture" alt="MetaMask" src="./metamask_logo.png"></img>
              </div>
              <div className="WalletStatusRight">
                <p className="StatusBarText">{walleterror}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="WalletOverview">
              <div>
                <p className="WalletHeading">Educhain Prototyp</p>
                <p>Aktuelles Guthaben: {balance} ETH </p>
              </div>
            </div>
            <div className="Educhain">
              <div id="starting" className="FunctionBar Hide">
                <p>Bitte wähle im Menü zwischen den Optionen Datennachweis erstellen bzw. prüfen oder lass dir einen Token ausstellen.</p>
              </div>
              <div id="data" className="FunctionBar Hide">
              <button className="StartButton" onClick={() => this.toggleCreate()}><span>Nachweis erstellen</span></button>
                <button className="StartButton" onClick={() => this.toggleProof()}><span>Dokument prüfen</span></button>
              </div>
              <div id="create" className="FunctionBar Hide">
                <div className="AddressBar">
                  <p>Bitte wähle die Datei von deinem Computer und gib eine Beschreibung sowie Namen an. Die Datei bleibt lokal in deinem Browser</p>
                </div>            
                <input id="datei" type="file"></input>
                <input id="beschreibung" type="text" placeholder="Beschreibung"></input>
                <input id="name" type="text" placeholder="Name"></input>
                <button className="FullSizeForwardButton" onClick={() => this.publish()}><span>Nachweis erstellen</span></button>
                <div id="createError" className="Bar Red">
                  <p>{error}</p>
                </div>
              </div>
              <div id="loading" className="Hide">
                <button className="BackButton MediumButton" onClick={() => this.refreshPage()}><span>abbrechen</span></button>
                <div id="loadstatusbar" className="EduchainStatusBar">
                  <img id="lspicture" className="Picture" alt="Loadingscreen" src="./loadingscreen.png"></img>
                  <div className="Message">
                    <p>{message}</p>
                  </div>
                </div>
              </div>
              <div id="finished" className="FunctionBar Hide">
                <div id="resultText" className="AddressBar FinalScreen">
                  <p>{proofMessage}</p>
                  <p></p>
                </div>
                <button className="BackButton MediumButton" onClick={() => this.refreshPage()}><span>zurück zum Hauptmenü</span></button>
              </div>
              <div id="proof" className="FunctionBar Hide">
                <div className="AddressBar">
                  <p>Bitte wähle die Datei von deinem Computer zu welcher du dir den Datennachweis anschauen möchtest.</p>
                </div>       
                <input id="nachweis" type="file"></input>
                <button id="proofButton" className="FullSizeForwardButton" onClick={() => this.proofData()}><span>Datei prüfen</span></button>
                <button id="getButton" className="FullSizeForwardButton Push" onClick={() => this.getData()}><span>Datei abrufen</span></button>
                <div id="proofmessage" className="Bar">
                  <p>{message}</p>
                </div>
                <div id="prooferror" className="Bar Red">
                  <p>{error}</p>
                </div>
              </div>
              <div id="token" className="FunctionBar Hide">
                <div className="TokenBar">
                  <p>Du kannst dir aller zehn Minuten einen educhain Token ausstellen lassen. Füge diese Adresse zu deiner MetaMask Wallet hinzu: <br></br><br></br> {tokenAddress}</p>
                </div>   
                <button className="FullSizeForwardButton" onClick={() => this.getToken()}><span>Token aushändigen lassen</span></button>
              </div>
              <div id="proofResult" className="FunctionBar Hide">     
                <div className="DateBar">
                  <h4>Einreichedatum: </h4>
                  <p className="Attr">{proofDate}</p>
                </div>    
                <div className="ProofBar">
                <h4>Addresse: </h4>
                  <p className="Attr">{proofAddress}</p>
                </div>
                <div className="ProofBar">
                <h4>Beschreibung: </h4>
                  <p className="Attr">{proofInfo}</p>
                </div>    
                <div className="ProofBar">
                <h4>Name: </h4>
                  <p className="Attr">{proofName}</p>
                </div>    
                <button className="BackButton Full" onClick={() => this.refreshPage()}><span>zurück zum Hauptmenü</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Functions declared within the App class
   */

  /**
   * CORE STACK
   */

  /**
   * Save wallet related errors to state
   * 
   * @param {raw string} walleterror 
   */
  logMetaMask = (walleterror) => {
    this.setState({ walleterror: String((walleterror || {}).metamask || walleterror) });
  }

  /**
   * Option Window Function: 
   * Manually refresh Page
   * from frontend
   */
  refreshPage = () => {
    window.location.reload();
  }

  /**
   * Loading the current balances of
   * Ethereum from the wallet
   * 
   * Asyncronus function, so information can be
   * resolved besides the regular program flow
   */
  updateBalance = async () => {
    const { web3 } = this.state;

    var accountaddress = web3.currentProvider.selectedAddress;
    this.setState({ address: accountaddress });
    const balance = await web3.eth.getBalance(accountaddress);
    this.setState({ balance: Number(web3.utils.fromWei(balance)).toFixed(5) });
  }

  /**
   * WINDOW CHANGES
   */

  /**
   * Option Window Function:
   * Hide all Windows
   */
  closeAll = () => {

    document.getElementById("starting").style.display = "none";
    document.getElementById("data").style.display = "none";
    document.getElementById("token").style.display = "none";
    document.getElementById("loading").style.display = "none";
    document.getElementById("proof").style.display = "none";
    document.getElementById("proofResult").style.display = "none";
    document.getElementById("finished").style.display = "none";
    document.getElementById("create").style.display = "none";
  }

  /**
   * Option Window Function:
   * Show data proof starting screen
   */
  toggleData = () => {
    this.closeAll();
    document.getElementById("data").style.display = "block";
  }
  
  /**
   * Option Window Function:
   * Show token starting screen
   */
  toggleToken = () => {
    this.closeAll();
    document.getElementById("token").style.display = "block";
  }

  /**
   * Option Window Function:
   * Show creation screen for data proof
   */
  toggleCreate = () => {
    this.closeAll();
    document.getElementById("create").style.display = "block";
  }

  /**
   * Option Window Function:
   * Show proving screen for data proof
   */
  toggleProof = () => {
    this.closeAll();
    document.getElementById("proof").style.display = "block";
    document.getElementById("getButton").style.display = "none";
  }

  /**
   * BUTTON FUNCTIONS
   */

  /**
   * Button Function:
   * input screen for publishing
   */  
   publish = () =>{    

    var datei = document.getElementById("datei").files[0];
    var tempbeschreibung = document.getElementById("beschreibung").value;
    var tempbenutzername = document.getElementById("name").value;
    var error = document.getElementById("createError");
    var binary;

    var format = /[ A-Za-z0-9]/;

    // no data
    if(document.getElementById("datei").files.length === 0){
        this.setState({ error: "Bitte füge eine Datei an zu welcher du einen Nachweis erstellen möchtest" });
        error.style.display = "block";
    }
    // no info
    else if(tempbeschreibung.toString().length === 0){
      this.setState({ error: "Bitte füge eine kurze Beschreibung für deinen Datennachweis ein" });
      error.style.display = "block";
    }
    // forgot to pick option
    else if(tempbenutzername.toString().length === 0){
      this.setState({ error: "Bitte füge deinen Namen oder ein gewünschtes Synonym ein" });
      error.style.display = "block";
    }
    // all set
    else if (format.test(tempbeschreibung) === false || format.test(tempbenutzername) === false){
      this.setState({ error: "Deine Beschreibung oder dein Name beinhaltet invalide Zeichen" });
      error.style.display = "block";
    }
    else{
      beschreibung = tempbeschreibung;
      benutzername = tempbenutzername;

      error.style.display = "none";
      var reader = new FileReader();
	  
      reader.onload = function(e) {
        binary = e.target.result;
        hash = md5(binary);
      };
      
    reader.readAsBinaryString(datei);
    this.setState({ message: "Dein Datennachweis wird übermittelt" });
    this.picturePulse(1);
    this.transmitData();
    }
  }

  /**
   * Button Function:
   * transmitting data
   */ 
  transmitData = async () =>{
    const { web3 } = this.state;
    const operator = new web3.eth.Contract(OperatorABI, operatorAddress);

    document.getElementById("create").style.display = "none";
    document.getElementById("loading").style.display = "block";
    var currentAddress = web3.currentProvider.selectedAddress;
    // waiting for trasmitted data event
    await operator.events.proofCreated()
          .on("data", function(event){
            if(currentAddress === event.returnValues.userAddress.toLowerCase()){
              document.getElementById("lspicture").className="Picture";
              document.getElementById("loading").style.display = "none"
              document.getElementById("finished").style.display = "block"
            }
    });

    var checkup = await operator.methods.getAddress(hash).call();
    if(checkup !== "0x0000000000000000000000000000000000000000"){
      this.setState({ proofMessage: "Der Datennachweis existiert bereits, bitte wähle eine neue Datei aus" });
      document.getElementById("loading").style.display = "none"
      document.getElementById("finished").style.display = "block"
    }
    else{
      this.createDataProof();
    }
  }

  /**
   * Button Function:
   * create proof on the blockchain
   */  
  createDataProof = async () => {
    const { web3 } = this.state;
    const operator = new web3.eth.Contract(OperatorABI, operatorAddress);
    await operator.methods.createDataProof(hash, beschreibung, benutzername).send({
      from: web3.currentProvider.selectedAddress});

    this.setState({ message: "Der Datennachweis wird erstellt" });
  }

  /**
   * Button Function:
   * checkup dataset from operator
   */  
  proofData = async () =>{
    const { web3 } = this.state;
    var datei = document.getElementById("nachweis").files[0];
    var error = document.getElementById("prooferror");
    var message = document.getElementById("proofmessage");
    var binary;

    // no data
    if(document.getElementById("nachweis").files.length === 0){
        this.setState({ error: "Bitte füge eine Datei an zu welcher du einen Nachweis erstellen möchtest" });
        error.style.display = "block";
    }
    // all set
    else{
      error.style.display = "none";
      var reader = new FileReader();
    
      reader.onload = function(e) {
        binary = e.target.result;
        hash = md5(binary);
      };

      reader.readAsBinaryString(datei);
      this.setState({ message: "Dein Datennachweis wird angefragt" });
      this.picturePulse(1);

      const operator = new web3.eth.Contract(OperatorABI, operatorAddress);
      var result = await operator.methods.getAddress(hash).call();
      // no address for file
      if(result === "0x0000000000000000000000000000000000000000"){
        if(this.state.firsttime){
          this.proofData();
          this.setState({ firsttime: false });
          this.setState({ message: "Dein Datennachweis wird angefragt" });
          message.style.display = "block";
        }
        else{
          this.setState({ message: "Diese Datei wurde noch nicht mit einem Datennachweis im System versehen" });
          message.style.display = "block";
        }
      }
      // valid data proof
      else{
        dataAddress = result;
        this.setState({ message: "Diese Datei befindet sich im System und kann jetzt abgerufen werden" });
        message.style.display = "block";
        document.getElementById("proofButton").style.display = "none";
        document.getElementById("getButton").style.display = "block";
      }
    }
  }

  /**
   * Button Function:
   * get data proof from the blockchain
   */  
  getData = async () =>{
    const { web3 } = this.state;
    this.setState({ firsttime: true });
    document.getElementById("proof").style.display = "none";

    this.setState({ message: "Datennachweis wird abgerufen" });
    document.getElementById("loading").style.display = "block";
    this.picturePulse(1);

    const dataProof = new web3.eth.Contract(DataProofABI, dataAddress);
    var datumraw = await dataProof.methods.time.call().call();
    var datum = new Date(datumraw * 1000).toString();
    
    this.setState({ proofAddress : await dataProof.methods.userAddress.call().call() });
    this.setState({ proofDate : datum});
    this.setState({ proofInfo : await dataProof.methods.info.call().call() });
    this.setState({ proofName : await dataProof.methods.name.call().call() });

    this.picturePulse(0);
    document.getElementById("loading").style.display = "none";
    document.getElementById("proofResult").style.display = "block";
  }

  /**
   * Button Function:
   * mint Educhain Token from the blockchain
   */  
  getToken = async () => {
    const { web3 } = this.state;
    const faucet = new web3.eth.Contract(FaucetABI, faucetAddress);
    await faucet.methods.requestTokens().send({
      from: web3.currentProvider.selectedAddress});
  }

  /**
   * INNER FUNCTIONS
   */

  /**
   * Inner Function:
   * Animates the RPS gestures within the loading screen
   * to indicate there is a pending transaction or
   * process that involves waiting for an answer
   * 
   * @param {boolean, indicates activity} bool 
   */
  picturePulse = (bool) => {
    // Enable animation
    if(bool === 1){
      document.getElementById("lspicture").className="Picture PicturePulse";
    }
    else{
      document.getElementById("lspicture").className="Picture";
    }
  }
}
export default App;