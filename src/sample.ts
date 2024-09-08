function maxProfit(prices: number[], fee: number): number {
    let profit:number[][]=[];
    let n:number=prices.length;
    for(let i=0;i<prices.length+1;i++) {
        profit[i]=[];
        for(let j=0;j<prices.length;j++) {
            profit[i][j]=0;
        }
    } 
    console.log(profit)
    for(let k=n-2;k>=0;k--) {


    }
   return 1; 
    
};
maxProfit([1,2,3],1);