import {EntitySchema} from 'typeorm'
import Setting from "../../../Domain/Setting";

const SettingEntity = new EntitySchema<Setting>({
    name: 'Setting',
    target: Setting,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            type: String
        },
        value: {
            type: String
        }
    },
    indices: [
        {
            name: 'name_idx',
            columns: ['name'],
            unique: true
        }
    ]
})

export default SettingEntity
