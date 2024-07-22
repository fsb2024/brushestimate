import BigNumber from 'bignumber.js'

export const add = (n1: string | number, n2: string | number): number => {
    return Number(new BigNumber(n1 || 0).plus(new BigNumber(n2 || 0)))
}

export const subtract = (n1: string | number, n2: string | number): number => {
    return Number(new BigNumber(n1 || 0).minus(new BigNumber(n2 || 0)))
}

export const multiply = (n1: string | number, n2: string | number): number => {
    return Number(new BigNumber(n1 || 0).multipliedBy(new BigNumber(n2 || 0)))
}

export const divide = (n1: string | number, n2: string | number): number => {
    return Number(new BigNumber(n1 || 0).dividedBy(new BigNumber(n2 || 0)))
}

export const toThousands = (num: string | number) => {
    const tNum = Number(num).toFixed(4)

    if (Number(tNum) === 0) return '0'

    const tag = (tNum || 0).toString().split('.')
    tag[0] = tag[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return tag.join('.')
}

export const getStakingMultiplier = (pledgeToken: number) => {
    return Math.max(1.03, add(1.03, divide(Math.log10(multiply(divide(pledgeToken, 1000000), 100)), 9)))
}

export const getTokenPledgeIncome = (totalToken: number, pledgeToken: number) => {
    const l = pledgeToken
    const q = 770000000

    const r1 = divide(multiply(q, 0.12), 365)
    const r2 = divide(l, Math.max(...[totalToken, 195000000]))

    return multiply(multiply(r1, r2), 1)
}

export const getNodeGrowth = (stocking: number, stockActivation: number, recommendedActivation: number) => {
    const r1 = multiply(stocking, 0.1)

    return add(r1, add(stockActivation, recommendedActivation))
}

export const getNodeGrowthMultiplier = (nodeGrowth: number) => {
    const r1 = divide(Math.log10(nodeGrowth), 10)

    return add(1, r1)
}

export const getDeviceIncome = (day7total: number, day7NodeActivation: number, stakingMultiplier: number, nodeGrowthMultiplier: number) => {
    const y = 1430000000
    const d = day7total
    const a = day7NodeActivation
    const x = 1
    const lc = stakingMultiplier
    const g = nodeGrowthMultiplier

    const r1 = divide(multiply(y, 0.3), 365)
    const r2 = divide(add(27, Math.log10(a)), 30)
    const r3 = divide(1, Math.max(divide(d, 5), 800))
    const r4 = multiply(multiply(x, lc), g)

    return multiply(multiply(multiply(r1, r2), r3), r4)
}


export const getUserEveryDayIncome = (score: number, total: number, stakingMultiplier: number) => {
    const fm = 23
    const ft = score
    const ac = total
    const at = 1
    const tt = divide(multiply(4200000000, 0.2), 365)
    const lc = stakingMultiplier
    const totalUserScore = multiply(total, 18.9)

    let res = multiply(tt, fm)
    res = multiply(res, ft)
    res = divide(res, totalUserScore)
    res = multiply(res, ac)
    res = divide(res, Math.max(ac, 20000))
    res = multiply(res, at)
    res = multiply(res, lc)

    return res
}
