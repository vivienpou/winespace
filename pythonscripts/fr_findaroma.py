import mysql.connector
import nltk
import sys
import re
nltk.data.path.append("/home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/venv/lib/python3.6/site-packages/nltk_data")
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from postaglist import postagliste_fr
##LEMATIZER######################
import sys
sys.path.insert(0, '//home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/venv/lib/python3.6/site-packages/french_lefff_lemmatizer/')
from french_lefff_lemmatizer import FrenchLefffLemmatizer
##
##STEMMER######################
from nltk.stem.snowball import FrenchStemmer
##

idretrieved = sys.argv[1]

JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"

home = '/home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/venv/lib/python3.6/site-packages'

from nltk.tag.stanford import StanfordPOSTagger as POS_Tag
_path_to_model = home + '/stanford-postagger-full-2018-10-16/models/french.tagger' 
_path_to_jar = home + '/stanford-postagger-full-2018-10-16/stanford-postagger-3.9.2.jar'
st = POS_Tag(_path_to_model, _path_to_jar)

def main():
    #connexion to the API
    conn=mysql.connector.connect(
        host='localhost',
        user='root',
        password='**',
        database='projets')
    cursor=conn.cursor()
    
    #retrieving the aromas through API
    sql="SELECT name, category FROM aroma_fr"
    cursor.execute(sql)
    results=cursor.fetchall()
    conn.close()
    cursor.close()

    #tokenize the data's (give aroma with category)
    token=nltk.word_tokenize(" ".join(str(x) for x in list(results)))
    #tokenize the data's (give aroma with category used to retrieve the category)
    tokens10=[str(x).lower() for x in list(results)]
        
    #tokenize the data's (give aroma without category)
    tokens=nltk.word_tokenize(" ".join(str(x[0]).lower() for x in list(results)))
    
    #connexion to the API
    conn=mysql.connector.connect(
        host='localhost',
        user='root',
        password='**',
        database='projets')
    cursor=conn.cursor()
    
    #retrieving the comment through API
    sql="SELECT comment_wine FROM wine WHERE id="+idretrieved
    cursor.execute(sql)
    resultats=cursor.fetchall()
    conn.close()
    cursor.close()
    
    #tokenize the data's comment
    tokens2=nltk.word_tokenize(" ".join(str(x) for x in list(resultats)))
    
    # list of useless words in NPL 
    stop_words_fr=list(set(stopwords.words('french')))

    #remove useless words from the comment we analyze 
    resultat=[]
    for word in tokens2:
        if (word not in stop_words_fr) and  ( word != "(" and word !=")" and word !="." and word !="," and word !="'")  :
            resultat.append(word)
            
    ##LEMATIZER######################
    lemmatizer = FrenchLefffLemmatizer()
    ##STEMMER######################
    stemmer = FrenchStemmer()
    #for the aromas
    tokensNotokenize=",".join(str(x[0]).lower() for x in list(results))
    tokensNotokenize=tokensNotokenize.split(',')
    
    #Build Lematize for aromas#####################
    resultat_lemmatized_aromas=[]
    for i in tokensNotokenize:
        if (' ' in i):
            i=i.split(' ')
            submod=[]
            for j in i:
                submod.append(lemmatizer.lemmatize(j))
            resultat_lemmatized_aromas.append(' '.join(submod))
        else:
            resultat_lemmatized_aromas.append(lemmatizer.lemmatize(i))
    
    #Build stemmatize for aromas#####################
    resultat_stemmed_aromas=[]
    for i in tokensNotokenize:
        if (' ' in i):
            i=i.split(' ')
            submod=[]
            for j in i:
                submod.append(stemmer.stem(j))
            resultat_stemmed_aromas.append(' '.join(submod))
        else:
            resultat_stemmed_aromas.append(stemmer.stem(i))
            
    #Build lemmatized for comment#####################
    resultat_lemmatized_comment=[lemmatizer.lemmatize(t) for t in resultat]

    #Build stemmatized for comment#####################
    resultat_stemmed_comment = [stemmer.stem(word) for word in resultat]
    
    #Matched aromas to store from comments, listedb and pertinence
    transmetter100=[]
    transmetter99=[]
    transmetter=[]
    for i in range(len(resultat_stemmed_comment)):
        for j in range(len(resultat_stemmed_aromas)):    
            if resultat_stemmed_comment[i] in resultat_stemmed_aromas[j] :
              if len(resultat_stemmed_comment[i])>2:
                if (len (resultat_stemmed_comment[i]) == len (resultat_stemmed_aromas[j])):
                    analyze100= {"matchedaromacomment":"","matchedaromaliste":"","matchedaromacategory":""}
                    analyze100["matchedaromacomment"]= resultat_stemmed_comment[i]
                    analyze100["matchedaromaliste"]= resultat_stemmed_aromas[j].replace("'"," ")
                    analyze100["matchedaromacategory"]= (tokens10[j].split(','))[1].replace(")","").replace("'","").strip()
                    transmetter100.append(analyze100)
            
                else:
                    analyze99= {"matchedaromacomment":"","matchedaromaliste":"","matchedaromacategory":""}
                    analyze99["matchedaromacomment"]= resultat_stemmed_comment[i]
                    analyze99["matchedaromaliste"]= resultat_stemmed_aromas[j].replace("'"," ")
                    analyze99["matchedaromacategory"]= (tokens10[j].split(','))[1].replace(")","").replace("'","").strip()
                    transmetter99.append(analyze99)
    transmetter.append(transmetter99)
    transmetter.append(transmetter100)
    transmetter='"'+str(transmetter)+'"'
    #print(transmetter)

    conn2=mysql.connector.connect(
        host='localhost',
        user='root',
        password='**',
        database='projets')
     
    cursor2=conn2.cursor()
    sql2='UPDATE wine SET aroms_analyzed='+transmetter+' WHERE id='+idretrieved
    cursor2.execute(sql2)
    conn2.commit()

    #print(resultatsdeux)
    
    conn2.close()
    cursor2.close()
    
if __name__ == "__main__":
    main()
