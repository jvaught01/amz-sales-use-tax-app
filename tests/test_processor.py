import pandas as pd
import numpy as np

file = 'tests/2024Jan1-2024Apr1_CustomCombinedTax.csv'
tax_nums = {
    "tsiCA" : 0,
    'tsfp' : 0,
    "tsios" : 0
}
def process_data(file):
    df = pd.read_csv(file)
    filtered_df = df[df['Jurisdiction_Level'] == 'State']
    pivot_table = np.around(filtered_df.pivot_table(index='Ship_To_State',values= 'TaxExclusive_Selling_Price', aggfunc=sum), 2)    
    
    return(pivot_table)
    
def do_calc(pivot_data, tax_nums):
    # START CALCULATIONS
    total_sum = pivot_data['TaxExclusive_Selling_Price'].sum()
    total_sum = np.round(total_sum, 2)
    tax_nums['tsfp'] = total_sum
    for state, sell_price in pivot_data.to_records():
        if state == "CA":
            Ca_1 = sell_price
        if state == "Ca":
            Ca_2 = sell_price
            add_ca = np.round(Ca_1 + Ca_2, 2)
            tax_nums['tsiCA'] = add_ca
    tax_nums['tsios'] = tax_nums['tsfp'] - tax_nums['tsiCA']
    return tax_nums
    
    
    
if __name__== "__main__":   
    pivot_data = process_data(file)
    data  = do_calc(pivot_data, tax_nums)