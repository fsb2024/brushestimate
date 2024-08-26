import './App.css'
import {useEffect, useRef, useState} from "react";
import {NumericFormat} from 'react-number-format';
import {Button, TextField, Divider, Select, MenuItem} from "@material-ui/core";
import {
    add,
    divide,
    getDeviceIncome,
    getNodeGrowth,
    getNodeGrowthMultiplier,
    getStakingMultiplier,
    getTokenPledgeIncome,
    getUserEveryDayIncome,
    multiply,
    toThousands
} from "./utils/comm";
import locales from "./locales";
import {useKey} from 'react-use';

const NumberFormatCustom = (props) => {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
        />
    );
}

const TokenPledgeFormula = ({stakingMultiplier, setStakingMultiplier, lan}) => {
    const [state, setState] = useState({
        totalToken: 200000000,
        pledgeToken: 100000,
        res: 0,
        annualRate: 0,
    })

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = () => {
        const res = getTokenPledgeIncome(state.totalToken, state.pledgeToken)
        const annualRate = divide(multiply(res, 365), state.pledgeToken)

        setState({...state, res, annualRate})
        setStakingMultiplier(getStakingMultiplier(state.pledgeToken))
    }

    useKey('Enter', handleSubmit, {}, [handleSubmit]);

    useEffect(() => {
        handleSubmit()
    }, []);

    return (
        <div>
            <h3 className="text-center">{locales[lan]['tokenTitle']}</h3>
            <p>{locales[lan]['tokenDesc']}</p>
            <TextField
                className="mb-20"
                label={locales[lan]['tokenLabel1']}
                name="totalToken"
                variant="outlined"
                helperText={locales[lan]['tokenLabel1Help']}
                InputProps={{
                    inputComponent: NumberFormatCustom,
                }}
                InputLabelProps={{
                    shrink: true
                }}
                value={state.totalToken}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                className="mb-20"
                label={locales[lan]['tokenLabel2']}
                name="pledgeToken"
                variant="outlined"
                InputProps={{
                    inputComponent: NumberFormatCustom,
                }}
                InputLabelProps={{
                    shrink: true
                }}
                value={state.pledgeToken}
                onChange={handleChange}
                fullWidth
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disableElevation>
                {locales[lan]['Calculate']}
            </Button>
            <div className="res">
                <h4>{locales[lan]['CalculateRes']}</h4>
                <p>{locales[lan]['tokenRes1']}：<span>{toThousands(state.res || 0)}</span></p>
                <p>{locales[lan]['tokenRes2']}：<span>{toThousands(multiply(state.annualRate|| 0, 100))}</span>%</p>
                <p>{locales[lan]['tokenRes3']}：<span>{toThousands(stakingMultiplier|| 0)}</span></p>
            </div>
        </div>
    )
}

const DeviceFormula = ({stakingMultiplier, lan}) => {
    const [state, setState] = useState({
        day7total: 2500,
        stocking: 500,
        stockActivation: 500,
        recommendedActivation: 500,
        day7NodeActivation: 125,
        res: 0,
        lastRes: 0,
        nodeGrowth: 0,
        nodeGrowthMultiplier: 0
    })

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = () => {
        const nodeGrowth = getNodeGrowth(state.stocking, state.stockActivation, state.recommendedActivation)
        const nodeGrowthMultiplier = getNodeGrowthMultiplier(nodeGrowth)

        const res = getDeviceIncome(state.day7total, state.day7NodeActivation, stakingMultiplier, nodeGrowthMultiplier)

        const deviceNum = add(state.stockActivation, state.recommendedActivation)
        const lastTu180 = multiply(deviceNum, getUserEveryDayIncome(0.8, deviceNum, stakingMultiplier))

        const lastRes = multiply(
            add(add(multiply(lastTu180, 0.05), multiply(lastTu180, 0.03)), multiply(lastTu180, 0.01)),
            multiply(multiply(1, stakingMultiplier), nodeGrowthMultiplier))

        setState({...state, res, nodeGrowth, nodeGrowthMultiplier, lastRes})
    }

    useKey('Enter', handleSubmit, {}, [handleSubmit]);

    return (
        <div>
            <h3 className="text-center">{locales[lan]['deviceTitle']}</h3>
            <p>{locales[lan]['deviceDesc']}</p>
            <TextField
                className="mb-20"
                label={locales[lan]['deviceLabel1']}
                name="day7total"
                variant="outlined"
                helperText={locales[lan]['deviceLabel1Help']}
                InputProps={{
                    inputComponent: NumberFormatCustom,
                }}
                InputLabelProps={{
                    shrink: true
                }}
                value={state.day7total}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                className="mb-20"
                label={locales[lan]['deviceLabel2']}
                name="stocking"
                variant="outlined"
                InputProps={{
                    inputComponent: NumberFormatCustom,
                }}
                InputLabelProps={{
                    shrink: true
                }}
                value={state.stocking}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                className="mb-20"
                label={locales[lan]['deviceLabel3']}
                name="stockActivation"
                variant="outlined"
                InputProps={{
                    inputComponent: NumberFormatCustom,
                }}
                InputLabelProps={{
                    shrink: true
                }}
                value={state.stockActivation}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                className="mb-20"
                label={locales[lan]['deviceLabel4']}
                name="recommendedActivation"
                variant="outlined"
                InputProps={{
                    inputComponent: NumberFormatCustom,
                }}
                InputLabelProps={{
                    shrink: true
                }}
                value={state.recommendedActivation}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                className="mb-20"
                label={locales[lan]['deviceLabel5']}
                name="day7NodeActivation"
                variant="outlined"
                InputProps={{
                    inputComponent: NumberFormatCustom,
                }}
                InputLabelProps={{
                    shrink: true
                }}
                value={state.day7NodeActivation}
                onChange={handleChange}
                fullWidth
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disableElevation>
                {locales[lan]['Calculate']}
            </Button>
            <div className="res">
                <h4>{locales[lan]['CalculateRes']}</h4>
                <p>{locales[lan]['deviceRes1']}：<span>{toThousands(state.res || 0)}</span></p>
                <p>{locales[lan]['deviceRes2']}：<span>{toThousands(state.nodeGrowth || 0)}</span></p>
                <p>{locales[lan]['deviceRes3']}：<span>{toThousands(state.nodeGrowthMultiplier|| 0)}</span></p>
                <p>{locales[lan]['deviceRes4']}：<span>{toThousands(state.lastRes || 0)}</span></p>
            </div>
            <p>{locales[lan]['deviceResHelp']}</p>
        </div>
    )
}

const UserFormula = ({stakingMultiplier, lan}) => {
    const [state, setState] = useState({
        total: 20000,
        score: 9.5,
        res: 0
    })

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = () => {
        const res = getUserEveryDayIncome(divide(state.score,10), state.total, stakingMultiplier)

        setState({...state, res})
    }

    useKey('Enter', handleSubmit, {}, [handleSubmit]);

    return (
        <div>
            <h3 className="text-center">{locales[lan]['userTitle']}</h3>
            <p>{locales[lan]['userDesc']}</p>
            <TextField
                className="mb-20"
                label={locales[lan]['userLabel1']}
                name="total"
                variant="outlined"
                helperText={locales[lan]['userLabel1Help']}
                InputProps={{
                    inputComponent: NumberFormatCustom,
                }}
                InputLabelProps={{
                    shrink: true
                }}
                value={state.total}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                className="mb-20"
                label={locales[lan]['userLabel2']}
                name="score"
                variant="outlined"
                helperText={locales[lan]['userLabel2Help']}
                InputProps={{
                    inputComponent: NumberFormatCustom,
                }}
                InputLabelProps={{
                    shrink: true
                }}
                value={state.score}
                onChange={handleChange}
                fullWidth
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disableElevation>
                {locales[lan]['Calculate']}
            </Button>
            <div className="res">
                <h4>{locales[lan]['CalculateRes']}</h4>
                <p>{locales[lan]['userRes1']}：<span>{toThousands(state.res || 0)}</span></p>
            </div>
        </div>
    )
}

function App() {
    const [lan, setLan] = useState('en')
    const [stakingMultiplier, setStakingMultiplier] = useState(1.03)

    const stakingMultiplierRef = useRef<number>(stakingMultiplier)

    const onChangeStakingMultiplier = (value)=> {
        stakingMultiplierRef.current = value
        setStakingMultiplier(value)
    }

    return (
        <>
            <div style={{textAlign: 'right'}}>
                <span style={{marginRight: 10}}>language</span>
                <Select
                    value={lan}
                    style={{width: 100, textAlign: 'center'}}
                    onChange={(e) => setLan(e.target.value as string)}
                >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="tw">繁體中文</MenuItem>
                </Select>
            </div>
            <h2 className="text-center">{locales[lan]['title']}</h2>
            <p className="text-center">{locales[lan]['desc']}</p>
            <TokenPledgeFormula
                stakingMultiplier={stakingMultiplierRef.current}
                setStakingMultiplier={onChangeStakingMultiplier}
                lan={lan}
            />
            <Divider style={{margin: '50px 0'}}/>
            <DeviceFormula stakingMultiplier={stakingMultiplierRef.current} lan={lan}/>
            <Divider style={{margin: '50px 0'}}/>
            <UserFormula stakingMultiplier={stakingMultiplierRef.current} lan={lan}/>
        </>
    )
}

export default App
