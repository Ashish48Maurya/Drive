import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function UploadFile({ contract, account, provider }) {
  const [file, setFile] = useState(null);
  const [list, setList] = useState([]);
  const [Aaddress, setAaddress] = useState("");
  const [fileName, setFileName] = useState("No image selected");

  const ref = useRef();
  const call = () => {
    ref.current.click();
  }
  const call1 = () => {
    ref.current.click();
  }
  const call2 = () => {
    ref.current.click();
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "2116f8d5d3eda0bd29e1",
            pinata_secret_api_key: "1858c1b96394993389570925ad7bb82be08f04f21d0d31a8520cf9738200b8f7",
            "Content-Type": "multipart/form-data",
          },
        });

        // const fileInfo = {
        //   name: file.name,
        //   size: file.size,
        //   type: file.type,
        //   lastModified: file.lastModified,
        // };
        // console.log(fileInfo);

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        contract.add(account, ImgHash);
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    } else {
      alert("No file selected");
    }
  };

  const accessList = async () => {
    const addressList = await contract.shareAccess();
    console.log(addressList)
    const userList = addressList.map(item => item.user);
    setList(userList);
  };

  const sharing = async () => {
    try {
      const tx = await contract.allow(Aaddress);
      await tx.wait(); 
      console.log('User allowed successfully');
      accessList(); 
    } catch (error) {
      console.error('Error allowing user:', error);
    }
  };

  const sharingOff = async () => {
    try {
      const tx = await contract.disallow(Aaddress);
      await tx.wait(); 
      console.log('User disallowed successfully');
      accessList(); 
    } catch (error) {
      console.error('Error disallowing user:', error);
    }
  };

  useEffect(() => {
    contract && accessList();
  }, [contract]);

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
  };

  return (
    <>

      <button type="button" ref={ref} class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style={{ "display": "none" }}>
        Launch static backdrop modal
      </button>

      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Understood</button>
            </div>
          </div>
        </div>
      </div>



      <div className='container col-6 '>
        <div className='head text-center'>Account: {account}</div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="container col-6 mt-4" />
          <div className="input-group mb-3 ">
            <input
              className="form-control border border-black"
              disabled={!account}
              type="file"
              id="file-upload"
              name="data"
              accept="image/*,video/*,.pdf"
              onChange={retrieveFile}
              placeholder="Enter Wallet Address..."
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <button className="btn btn-primary" type="submit" id="button-addon2" disabled={!file}>
              Upload
            </button>
          </div>
        </form>
        <div className="input-group mb-5">
          <input
            value={Aaddress}
            onChange={(e) => { setAaddress(e.target.value) }}
            className="form-control border border-black"
            placeholder="Enter Wallet Address..."
            aria-label="Recipient's username with two button addons"
          />
          <button className="btn btn-success address" type="button" onClick={() => sharing()}>
            Allow
          </button>
          <button className="btn btn-danger" type="button" onClick={() => sharingOff()}>
            Disallow
          </button>
        </div>
        <div className='d-flex justify-content-between mt-5 mb-4'>
          <div className='d-flex flex-column head text-center ' onClick={() => { call() }}>
            <img src="Images/image.png" alt="" />
            <span>Image</span>
          </div>
          <div className='d-flex flex-column head text-center ' onClick={() => { call1() }}>
            <img src="Images/video.png" alt="" />
            <span>Video</span>
          </div>
          <div className='d-flex flex-column head text-center' onClick={() => { call2() }}>
            <img src="Images/pdf.png" alt="" />
            <span>Pdf</span>
          </div>
        </div>
        <ul className="list-group mt-5">
          {list.map((address, index) => (
            <li key={index} className="list-group-item border border-black">{address}</li>
          ))}
        </ul>
      </div>

      <style>
        {`
                    body {
                        background: linear-gradient(to left, #7a0b0b, #9a1e11);
                        overflow-y: hidden
                    }
                    li{
                        text-align:center;
                    }
                    img{
                        height:200px;
                        width:200px
                    }
                    .head{
                      color:white;
                    }
                `}
      </style>
    </>
  )
}
