from sklearn.linear_model import (
    LogisticRegression,
    LinearRegression
)

from sklearn.tree import (
    DecisionTreeClassifier,
    DecisionTreeRegressor
)

from sklearn.ensemble import (
    RandomForestClassifier,
    RandomForestRegressor
)

from sklearn.svm import (
    SVC,
    SVR
)

from sklearn.neighbors import (
    KNeighborsClassifier,
    KNeighborsRegressor
)

from sklearn.naive_bayes import GaussianNB

from sklearn.cluster import (
    KMeans,
    DBSCAN,
    AgglomerativeClustering
)


CLASSIFICATION_MODELS = {

    "logistic_regression":
        LogisticRegression(),

    "decision_tree":
        DecisionTreeClassifier(),

    "random_forest":
        RandomForestClassifier(),

    "svm":
        SVC(probability=True),

    "knn":
        KNeighborsClassifier(),

    "naive_bayes":
        GaussianNB()

}


REGRESSION_MODELS = {

    "linear_regression":
        LinearRegression(),

    "decision_tree":
        DecisionTreeRegressor(),

    "random_forest":
        RandomForestRegressor(),

    "svr":
        SVR(),

    "knn":
        KNeighborsRegressor()

}


CLUSTERING_MODELS = {

    "kmeans":
        KMeans(),

    "dbscan":
        DBSCAN(),

    "agglomerative":
        AgglomerativeClustering()

}