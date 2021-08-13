import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IConnection } from '../common/IConnection';

export class PelionConnection {

    private static _instance:PelionConnection = null;

    private axios: AxiosInstance = null;

    constructor(connection: IConnection) { 
        this.axios = axios.create({
            baseURL: 'https://api.us-east-1.mbedcloud.com/', // TODO: configurable API endpoint
            headers: {'Authorization': `Bearer ${connection.accessKey}`},
            responseType: 'json'
          });
    }

    public static getInstance(connection?: IConnection): PelionConnection {
        if (!this._instance) {
            this._instance = new PelionConnection(connection);
        }
        return this._instance;
    }
     
    public async getDevices(): Promise<AxiosResponse> {
        return await this.axios.get("v3/devices?order=DESC");
    }

    public async getResources(deviceId: string): Promise<AxiosResponse> {
        return this.axios.get(`v2/endpoints/${deviceId}`);
    }
}