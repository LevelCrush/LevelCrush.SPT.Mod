New SICC case for meds

# Medical SICC case



Add a new SICC case that can hold meds



You can buy the item from Therapist (level 1) with 100000 Roubles => it's a valuable item.



In case the item does not show (empty box) => clear the temp folder.



How to modify the case space:

In the config.json file there is a parameter called "columns"
The value inside it are objects inside an array
each object has a "cellH" and "cellV"
To add a new column, simply add a new object with "cellH" and "cellV" to the "columns" array