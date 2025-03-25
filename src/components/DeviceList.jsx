import { useEffect, useState } from "react";
import { getDevices, removeDevice } from "../utils/auth";
import useragentParser from "../utils/useragentParser";
import "../styles/devices.css"
import Confirm from "./Confirm";

let confirmTitle, confirmContent = null;
let selectedDevice = null;

function DeviceList() {
    const [devices, setDevices] = useState([])

    const updateDevices = async () => {
        let devicees = (await getDevices()).data;
        console.log(devicees)
        for (let i in devicees) {
            devicees[i].deviceInfo = JSON.parse(devicees[i].deviceInfo)
        }
        setDevices(devicees)
    }

    useEffect(() => {
        updateDevices();
    }, [])

    const [showConfirm, setShowConfirm] = useState(false);
    

    const removeDeviceHandler = (deviceID) => {
        selectedDevice = deviceID;
        confirmTitle = "Do you want to remove this device?"
        confirmContent = "This action is irreversible."
        setShowConfirm(true);
    }

    const rmDevice = () => {
        removeDevice(selectedDevice).then((response) => {
            console.log(response);
            if (response.success == true) {
                selectedDevice = null;
                setShowConfirm(false)
                updateDevices();
            }
        })
    }

    return <>
        <div className="devices">
            {devices.map((device) => <div onClick={() => {removeDeviceHandler(device.deviceID)}} className={`device ${device.current ? "current" : ""}`}>{`${device.deviceInfo.deviceName} | ${useragentParser(device.deviceInfo["user-agent"]).browser}:${useragentParser(device.deviceInfo["user-agent"]).version}`}</div>)}
        </div>
        {showConfirm? <Confirm onCancel={() => {setShowConfirm(false)}} onConfirm={rmDevice} title={confirmTitle} content={confirmContent}/>:""}
    </>
}

export default DeviceList;