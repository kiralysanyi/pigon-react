import { useEffect, useState } from "react";
import { getDevices } from "../utils/auth";
import useragentParser from "../utils/useragentParser";
import "../styles/devices.css"


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

    return <div className="devices">
        {devices.map((device) => <div className={`device ${device.current? "current": ""}`}>{`${device.deviceInfo.deviceName} | ${useragentParser(device.deviceInfo["user-agent"]).browser}:${useragentParser(device.deviceInfo["user-agent"]).version}`}</div>)}
    </div>
}

export default DeviceList;