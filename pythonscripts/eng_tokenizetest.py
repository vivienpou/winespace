import mysql.connector
import nltk
import sys
nltk.data.path.append("/home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/venv/lib/python3.6/site-packages/nltk_data")
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from postaglist import postagliste_en
##LEMATIZER######################
from nltk.stem import WordNetLemmatizer
##
##STEMMER######################
from nltk.stem.porter import PorterStemmer
##

idretrieved = sys.argv[1]

JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"

home = '/home/vivienpou/Documents/DataLinuxWCS/Projet/bordeaux-0918-js-winespace/pythonscripts/venv/lib/python3.6/site-packages'

from nltk.tag.stanford import StanfordPOSTagger as POS_Tag
_path_to_model = home + '/stanford-postagger-full-2018-10-16/models/english-bidirectional-distsim.tagger' 
_path_to_jar = home + '/stanford-postagger-full-2018-10-16/stanford-postagger-3.9.2.jar'
st = POS_Tag(_path_to_model, _path_to_jar)

def main():
    conn=mysql.connector.connect(
        host='localhost',
        user='root',
        password='**',
        database='projets')

    cursor=conn.cursor()
    
    sql="SELECT comment_wine FROM wine WHERE id=1"+idretrieved
    cursor.execute(sql)
    
    resultats=cursor.fetchall()

    #print(resultats)
    #print('')

    tokens=nltk.word_tokenize(" ".join(str(x) for x in list(resultats)))
    ##print(tokens)

    # list of useless words in NPL (var out: stop_words_en || fr)

    stop_words_en=list(set(stopwords.words('english')))
    ##print(stop_words_en)
    ##print('')
    
    #  to remove useless words from the text we analyze (var in: stop_words_en || fr, var out:resultat)

    resultat=[]
    
    for word in tokens:
        if word not in stop_words_en:
            resultat.append(word)
    #print(resultat)
            
    ###We chose now to lematize or stem###
    ##LEMATIZER######################
    lemmatizer = WordNetLemmatizer()
    resultat_lemmatized=[lemmatizer.lemmatize(t) for t in resultat]
    ##print(resultat_lemmatized)
    ##

    ##STEMMER######################
    stemmer = PorterStemmer()
    resultat_stemmed = [stemmer.stem(word) for word in resultat]
    

    #POS_TAG- WORDS CATEGORIZED
    conn.close()
    cursor.close()
    categories_lem=st.tag(resultat_lemmatized)
    categories_stem=st.tag(resultat_stemmed)
    stringified=''
    for i in categories_lem:
        stringified+= "'"+str(i[0])+"':'"+str(i[1])+"',"
    stringified=stringified[:-1]
    stringified='"'+str(stringified)+'"'
    #print(categories_lem)
    #print('')
    #print(categories_stem)
    
    conn2=mysql.connector.connect(
        host='localhost',
        user='root',
        password='**',
        database='projets')
     
    cursor2=conn2.cursor()
    sql2='UPDATE wine SET comment_wine_analyzed='+stringified+' WHERE id='+idretrieved
    cursor2.execute(sql2)
    conn2.commit()

    #print(resultatsdeux)
    
    conn2.close()
    cursor2.close()

    #print(stringified)
    
if __name__ == "__main__":
    main()
